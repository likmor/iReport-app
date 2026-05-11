using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace backend.Infrastructure
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		public DbSet<User> Users => Set<User>();
		public DbSet<Report> Reports => Set<Report>();
		public DbSet<Category> Categories => Set<Category>();
		public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

		protected override void OnModelCreating(ModelBuilder builder)
		{
			builder.Entity<Report>()
				.HasOne(r => r.User)
				.WithMany(u => u.Reports)
				.HasForeignKey(r => r.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			builder.Entity<Report>()
				.HasOne(r => r.AssignedOfficial)
				.WithMany()
				.HasForeignKey(r => r.AssignedOfficialId)
				.OnDelete(DeleteBehavior.SetNull);
		}
	}
}
