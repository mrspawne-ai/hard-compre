using HardCompare.Api.Models;

namespace HardCompare.Api.Services;

public static class AdminSeeder
{
    private const string AdminEmail = "admin@hardcompare.com";
    private const string AdminPassword = "admin123";

    public static async Task SeedAsync(IUserRepository repo)
    {
        var users = repo.GetAll();

        var admins = users.Where(u => u.Role == "admin").ToList();
        if (admins.Count > 1)
        {
            users = [admins[0], .. users.Where(u => u.Role != "admin")];
            repo.Save(users);
        }

        if (!users.Any(u => u.Role == "admin"))
        {
            var hash = await Task.Run(() => BCrypt.Net.BCrypt.HashPassword(AdminPassword, 10));
            users.Add(new User
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Admin",
                Email = AdminEmail,
                PasswordHash = hash,
                Role = "admin",
                Plan = "Pro",
                JoinDate = "January 2026",
                Status = "active",
                CreatedAt = DateTime.UtcNow.ToString("o"),
            });
            repo.Save(users);
            Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            Console.WriteLine("  Admin account created");
            Console.WriteLine($"  Email   : {AdminEmail}");
            Console.WriteLine($"  Password: {AdminPassword}");
            Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        }
    }
}
