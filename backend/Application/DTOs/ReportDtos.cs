namespace backend.Application.DTOs
{
	public record CategoryDto(int Id, string Name, string Icon);
	public record CreateReportRequest(
		string Title,
		string Description,
		int CategoryId,
		double Latitude,
		double Longitude
	);

	public record ReportDto(
		int Id,
		string Title,
		string Description,
		CategoryDto Category,
		string Status,
		double Latitude,
		double Longitude,
		string CreatedAt
	);
}
