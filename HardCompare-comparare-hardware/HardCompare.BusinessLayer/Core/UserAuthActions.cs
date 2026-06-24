using HardCompare.DataAccessLayer.Context;
using HardCompare.Domain.Entities;
using HardCompare.Domain.Models.Service;
using HardCompare.Domain.Models.User;
using Microsoft.EntityFrameworkCore;

namespace HardCompare.BusinessLayer.Core;

public class UserAuthActions
{
    private const string AdminEmail = "admin@hardcompare.com";

    protected async Task<ServiceResponse> RegisterActionExecution(UserCreateDto dto)
    {
        if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            return new ServiceResponse { IsSuccess = false, Message = "Email and password are required." };
        if (dto.Password.Length < 6)
            return new ServiceResponse { IsSuccess = false, Message = "Password must be at least 6 characters." };
        if (dto.Email.ToLower() == AdminEmail)
            return new ServiceResponse { IsSuccess = false, Message = "Email already registered." };

        await using var db = new HardCompareDbContext();
        if (await db.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            return new ServiceResponse { IsSuccess = false, Message = "Email already registered." };

        var user = new UserEntity
        {
            Name = !string.IsNullOrWhiteSpace(dto.Name) ? dto.Name.Trim() : dto.Email.Split('@')[0],
            Email = dto.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, 10),
            Role = UserRole.User,
            Plan = "Free",
            Status = "active",
            RegisteredOn = DateTime.UtcNow,
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return new ServiceResponse { IsSuccess = true, Message = "Registration successful.", Data = ToInfoDto(user) };
    }

    protected async Task<ServiceResponse> LoginActionExecution(UserLoginDto dto)
    {
        if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            return new ServiceResponse { IsSuccess = false, Message = "Email and password are required." };

        await using var db = new HardCompareDbContext();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return new ServiceResponse { IsSuccess = false, Message = "Invalid email or password." };

        if (user.Status == "banned")
            return new ServiceResponse { IsSuccess = false, Message = "Account is banned." };

        return new ServiceResponse { IsSuccess = true, Message = "Login successful.", Data = ToInfoDto(user) };
    }

    protected async Task<ServiceResponse> GetMeActionExecution(int userId)
    {
        await using var db = new HardCompareDbContext();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
            return new ServiceResponse { IsSuccess = false, Message = "User not found." };

        return new ServiceResponse { IsSuccess = true, Data = ToInfoDto(user) };
    }

    protected async Task<ServiceResponse> UpdateMeActionExecution(int userId, UserUpdateDto dto)
    {
        await using var db = new HardCompareDbContext();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
            return new ServiceResponse { IsSuccess = false, Message = "User not found." };

        if (user.Role == UserRole.Admin && !string.IsNullOrEmpty(dto.Email) &&
            dto.Email.ToLower() != AdminEmail)
            return new ServiceResponse { IsSuccess = false, Message = "Admin email address cannot be changed." };

        if (!string.IsNullOrEmpty(dto.Email) && dto.Email.ToLower() != user.Email)
        {
            if (await db.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower() && u.Id != userId))
                return new ServiceResponse { IsSuccess = false, Message = "Email already in use." };
        }

        if (!string.IsNullOrWhiteSpace(dto.Name)) user.Name = dto.Name.Trim();
        if (!string.IsNullOrEmpty(dto.Email) && user.Role != UserRole.Admin)
            user.Email = dto.Email.ToLower();

        await db.SaveChangesAsync();
        return new ServiceResponse { IsSuccess = true, Data = ToInfoDto(user) };
    }

    private static UserInfoDto ToInfoDto(UserEntity u) => new()
    {
        Id = u.Id,
        Name = u.Name,
        Email = u.Email,
        Role = u.Role == UserRole.Admin ? "admin" : "user",
        Plan = u.Plan,
        Status = u.Status,
        JoinDate = u.RegisteredOn.ToString("MMMM yyyy"),
    };
}
