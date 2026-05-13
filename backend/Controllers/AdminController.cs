using backend.Application.DTOs;
using backend.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
	[ApiController]
	[Route("api/admin")]
	[Authorize(Roles = "Admin")]
	public class AdminController : ControllerBase
	{
		private readonly AppDbContext _db;
		public AdminController(AppDbContext db)
		{
			_db = db;
		}

		[HttpGet("users")]
		public async Task<IActionResult> GetUsers()
		{
			var users = await _db.Users
				.Select(u => new UserDto(u.Id, u.FullName, u.Email, u.Role.ToString(), u.CreatedAt.ToString("o")))
				.ToListAsync();
			return Ok(users);
		}

		[HttpPatch("users/{id}/role")]
		public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleRequest request)
		{
			var user = await _db.Users.FindAsync(id);
			if (user is null) return NotFound();

			if (!Enum.TryParse<UserRole>(request.Role, out var role))
				return BadRequest("Invalid role");

			user.Role = role;
			await _db.SaveChangesAsync();
			return Ok();
		}
	}
}
