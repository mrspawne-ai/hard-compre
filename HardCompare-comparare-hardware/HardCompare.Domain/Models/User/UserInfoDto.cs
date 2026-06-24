namespace HardCompare.Domain.Models.User;

public class UserInfoDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "user";
    public string Plan { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string JoinDate { get; set; } = string.Empty;
}
