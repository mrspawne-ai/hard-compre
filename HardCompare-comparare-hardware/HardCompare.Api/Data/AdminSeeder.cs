using HardCompare.DataAccessLayer.Context;
using HardCompare.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HardCompare.Api.Data;

public static class AdminSeeder
{
    private const string AdminEmail = "admin@hardcompare.com";
    private const string AdminPassword = "admin123";

    public static async Task SeedAsync()
    {
        await using var db = new HardCompareDbContext();

        var admins = await db.Users.Where(u => u.Role == UserRole.Admin).ToListAsync();
        if (admins.Count > 1)
        {
            db.Users.RemoveRange(admins.Skip(1));
            await db.SaveChangesAsync();
        }

        if (!await db.Users.AnyAsync(u => u.Role == UserRole.Admin))
        {
            var hash = await Task.Run(() => BCrypt.Net.BCrypt.HashPassword(AdminPassword, 10));
            db.Users.Add(new UserEntity
            {
                Name = "Admin",
                Email = AdminEmail,
                PasswordHash = hash,
                Role = UserRole.Admin,
                Plan = "Pro",
                Status = "active",
                RegisteredOn = DateTime.UtcNow,
            });
            await db.SaveChangesAsync();
            Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            Console.WriteLine("  Admin account created");
            Console.WriteLine($"  Email   : {AdminEmail}");
            Console.WriteLine($"  Password: {AdminPassword}");
            Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        }
    }
}
