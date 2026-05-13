namespace backend.Application.DTOs
{
	public record UserDto(int Id, string FullName, string Email, string Role, string CreatedAt);
	public record ChangeRoleRequest(string Role);
}
