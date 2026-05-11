using backend.Application.DTOs;
using backend.Domain.Entities;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using RegisterRequest = backend.Application.DTOs.RegisterRequest;
using LoginRequest = backend.Application.DTOs.LoginRequest;
using backend.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
	public interface IAuthService
	{
		Task<AuthResponse> RegisterAsync(RegisterRequest request);
		Task<AuthResponse> LoginAsync(LoginRequest request);
		Task<AuthResponse> RefreshAsync(string refreshToken);
	}

	public class AuthService : IAuthService
	{
		private readonly AppDbContext _db;
		private readonly IConfiguration _config;

		public AuthService(AppDbContext db, IConfiguration config)
		{
			_db = db;
			_config = config;
		}

		public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
		{
			if (await _db.Users.AnyAsync(u => u.Email == request.Email))
				throw new Exception("Email already in use");

			var user = new User
			{
				Email = request.Email,
				FullName = request.FullName,
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
			};

			_db.Users.Add(user);
			await _db.SaveChangesAsync();

			return await GenerateTokensAsync(user);
		}

		public async Task<AuthResponse> LoginAsync(LoginRequest request)
		{
			var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email)
				?? throw new Exception("Invalid credentials");

			if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
				throw new Exception("Invalid credentials");

			return await GenerateTokensAsync(user);
		}

		public async Task<AuthResponse> RefreshAsync(string refreshToken)
		{
			var token = await _db.RefreshTokens
				.Include(t => t.User)
				.FirstOrDefaultAsync(t => t.Token == refreshToken && !t.IsRevoked)
				?? throw new Exception("Invalid refresh token");

			if (token.ExpiresAt < DateTime.UtcNow)
				throw new Exception("Refresh token expired");

			token.IsRevoked = true;
			await _db.SaveChangesAsync();

			return await GenerateTokensAsync(token.User);
		}

		private async Task<AuthResponse> GenerateTokensAsync(User user)
		{
			var claims = new[]
			{
			new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
			new Claim(ClaimTypes.Email, user.Email),
			new Claim(ClaimTypes.Role, user.Role.ToString())
		};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
			var jwt = new JwtSecurityToken(
				issuer: _config["Jwt:Issuer"],
				audience: _config["Jwt:Audience"],
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(int.Parse(_config["Jwt:AccessTokenExpiryMinutes"]!)),
				signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
			);

			var refreshToken = new RefreshToken
			{
				Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
				ExpiresAt = DateTime.UtcNow.AddDays(int.Parse(_config["Jwt:RefreshTokenExpiryDays"]!)),
				UserId = user.Id
			};

			_db.RefreshTokens.Add(refreshToken);
			await _db.SaveChangesAsync();

			return new AuthResponse(
				AccessToken: new JwtSecurityTokenHandler().WriteToken(jwt),
				RefreshToken: refreshToken.Token
			);
		}
	}
}
