using backend.Application.DTOs;
using backend.Domain.Entities;
using backend.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

		[HttpGet]
		public async Task<IActionResult> GetAll()
		{
			var reports = await _db.Reports
				.Include(r => r.Category)
				.OrderByDescending(r => r.CreatedAt)
				.Select(r => new ReportDto(
					r.Id, r.Title, r.Description,
					new CategoryDto(r.Category.Id, r.Category.Name, r.Category.Icon),
					r.Status.ToString(),
					r.Latitude, r.Longitude,
					r.CreatedAt.ToString("o")))
				.ToListAsync();

			return Ok(reports);
		}

		[Authorize]
		[HttpPost]
		public async Task<IActionResult> Create(CreateReportRequest request)
		{
			var userId = int.Parse(User.FindFirstValue("id")!);

			var report = new Report
			{
				Title = request.Title,
				Description = request.Description,
				CategoryId = request.CategoryId,
				Latitude = request.Latitude,
				Longitude = request.Longitude,
				UserId = userId,
				Status= ReportStatus.New,
			};

			_db.Reports.Add(report);
			await _db.SaveChangesAsync();

			return Ok(report.Id);
		}
	}
}
