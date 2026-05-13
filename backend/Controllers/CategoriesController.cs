using backend.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
	[ApiController]
	[Route("api/categories")]
	public class CategoriesController : ControllerBase
	{
		private readonly AppDbContext _db;
		public CategoriesController(AppDbContext db)
		{
			_db = db;
		}

		[HttpGet]
		public async Task<IActionResult> GetAll() =>
			Ok(await _db.Categories.ToListAsync());
	}
}
