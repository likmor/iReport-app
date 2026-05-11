
using backend.Infrastructure;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace backend
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// Add services to the container.
			builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(options =>
				 {
					 options.TokenValidationParameters = new TokenValidationParameters
					 {
						 ValidateIssuer = true,
						 ValidateAudience = true,
						 ValidateLifetime = true,
						 ValidateIssuerSigningKey = true,
						 ValidIssuer = builder.Configuration["Jwt:Issuer"],
						 ValidAudience = builder.Configuration["Jwt:Audience"],
						 IssuerSigningKey = new SymmetricSecurityKey(
							 Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]))
					 };
				 });

			builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

			builder.Services.AddAuthorization();
			builder.Services.AddScoped<IAuthService, AuthService>();

			builder.Services.AddControllers();
			// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();

			var app = builder.Build();

			app.UseAuthentication();
			app.UseAuthorization();

			// Configure the HTTP request pipeline.
			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseHttpsRedirection();

			app.UseAuthorization();


			app.MapControllers();

			app.Run();
		}
	}
}
