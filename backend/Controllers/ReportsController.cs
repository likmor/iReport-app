using backend.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ReportsController : ControllerBase
	{

		private readonly AppDbContext _db;
		public ReportsController(AppDbContext db)
		{
			_db = db;
		}

		[Authorize(Roles = "User, Admin")]
		[HttpGet("my")]
		public async Task<IActionResult> GetMyReports()
		{
			var userId = int.Parse(User.FindFirstValue("id")!);
			var reports = await _db.Reports
				.Where(r => r.UserId == userId)
				.Include(r => r.Category)
				.OrderByDescending(r => r.CreatedAt)
				.ToListAsync();

			return Ok(reports);
		}
	}
}
