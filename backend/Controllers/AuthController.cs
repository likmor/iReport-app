using backend.Services;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using RegisterRequest = backend.Application.DTOs.RegisterRequest;
using LoginRequest = backend.Application.DTOs.LoginRequest;

namespace backend.Controllers
{
	[ApiController]
	[Route("api/auth")]
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _auth;
		public AuthController(IAuthService auth) => _auth = auth;

		[HttpPost("register")]
		public async Task<IActionResult> Register(RegisterRequest request)
		{
			var result = await _auth.RegisterAsync(request);
			return Ok(result);
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login(LoginRequest request)
		{
			var result = await _auth.LoginAsync(request);
			return Ok(result);
		}

		[HttpPost("refresh")]
		public async Task<IActionResult> Refresh([FromBody] string refreshToken)
		{
			var result = await _auth.RefreshAsync(refreshToken);
			return Ok(result);
		}
	}
}
