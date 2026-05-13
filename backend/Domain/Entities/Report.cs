namespace backend.Domain.Entities
{
	public class Report
	{
		public int Id { get; set; }
		public string Title { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public ReportStatus Status { get; set; } = ReportStatus.New;

		public double Latitude { get; set; }
		public double Longitude { get; set; }

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public DateTime? UpdatedAt { get; set; }

		public int CategoryId { get; set; }
		public Category Category { get; set; } = null!;

		public int UserId { get; set; }
		public User User { get; set; } = null!;

		public int? AssignedOfficialId { get; set; }
		public User? AssignedOfficial { get; set; }

	}

	public enum ReportStatus
	{
		New,
		InProgress,
		Resolved,
		Rejected
	}
}
