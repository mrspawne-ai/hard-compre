using System.Text.Json.Serialization;

namespace HardCompare.Api.Models;

public class User
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "user";
    public string Plan { get; set; } = "Free";
    public string JoinDate { get; set; } = string.Empty;
    public string Status { get; set; } = "active";
    public string CreatedAt { get; set; } = string.Empty;

    [JsonIgnore]
    public SafeUser Safe => new()
    {
        Id = Id, Name = Name, Email = Email, Role = Role,
        Plan = Plan, JoinDate = JoinDate, Status = Status, CreatedAt = CreatedAt,
    };
}

public class SafeUser
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Plan { get; set; } = string.Empty;
    public string JoinDate { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
}
