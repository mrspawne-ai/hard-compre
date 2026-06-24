namespace HardCompare.Domain.Entities;

public class UserEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.User;
    public string Plan { get; set; } = "Free";
    public string Status { get; set; } = "active";
    public DateTime RegisteredOn { get; set; }
}
