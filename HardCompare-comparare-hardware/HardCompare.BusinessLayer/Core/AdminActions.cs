using HardCompare.DataAccessLayer.Context;
using HardCompare.DataAccessLayer.Repositories;
using HardCompare.Domain.Entities;
using HardCompare.Domain.Models.Hardware;
using HardCompare.Domain.Models.Service;
using HardCompare.Domain.Models.User;
using Microsoft.EntityFrameworkCore;

namespace HardCompare.BusinessLayer.Core;

public class AdminActions
{
    private readonly HardwareModelRepository _modelRepo;

    public AdminActions(HardwareModelRepository modelRepo) => _modelRepo = modelRepo;

    protected async Task<object> GetStatsActionExecution()
    {
        await using var db = new HardCompareDbContext();
        var monthAgo = DateTime.UtcNow.AddMonths(-1);
        var users = await db.Users.Where(u => u.Role != UserRole.Admin).ToListAsync();
        var contacts = await db.Contacts.ToListAsync();

        return new
        {
            totalUsers = users.Count,
            activeUsers = users.Count(u => u.Status == "active"),
            newUsersThisMonth = users.Count(u => u.RegisteredOn > monthAgo),
            totalModels = await db.HardwareModels.CountAsync(),
            totalContacts = contacts.Count,
            pendingContacts = contacts.Count(c => !c.Resolved),
        };
    }

    protected async Task<List<UserInfoDto>> GetUsersActionExecution(string? q)
    {
        await using var db = new HardCompareDbContext();
        var users = await db.Users.Where(u => u.Role != UserRole.Admin).ToListAsync();

        if (!string.IsNullOrEmpty(q))
        {
            var lower = q.ToLower();
            users = users.Where(u =>
                u.Name.ToLower().Contains(lower) || u.Email.ToLower().Contains(lower)).ToList();
        }

        return users.Select(u => new UserInfoDto
        {
            Id = u.Id, Name = u.Name, Email = u.Email,
            Role = u.Role == UserRole.Admin ? "admin" : "user",
            Plan = u.Plan, Status = u.Status,
            JoinDate = u.RegisteredOn.ToString("MMMM yyyy"),
        }).ToList();
    }

    protected async Task<ServiceResponse> UpdateUserActionExecution(int id, AdminUpdateUserDto dto)
    {
        await using var db = new HardCompareDbContext();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null)
            return new ServiceResponse { IsSuccess = false, Message = "User not found." };

        if (user.Role == UserRole.Admin)
            return new ServiceResponse { IsSuccess = false, Message = "The admin account cannot be modified here." };

        if (!string.IsNullOrEmpty(dto.Name)) user.Name = dto.Name;
        if (!string.IsNullOrEmpty(dto.Email)) user.Email = dto.Email;
        if (!string.IsNullOrEmpty(dto.Status)) user.Status = dto.Status;

        await db.SaveChangesAsync();
        return new ServiceResponse
        {
            IsSuccess = true,
            Data = new UserInfoDto
            {
                Id = user.Id, Name = user.Name, Email = user.Email,
                Role = user.Role == UserRole.Admin ? "admin" : "user",
                Plan = user.Plan, Status = user.Status,
                JoinDate = user.RegisteredOn.ToString("MMMM yyyy"),
            }
        };
    }

    protected async Task<ServiceResponse> DeleteUserActionExecution(int id)
    {
        await using var db = new HardCompareDbContext();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null)
            return new ServiceResponse { IsSuccess = false, Message = "User not found." };

        if (user.Role == UserRole.Admin)
            return new ServiceResponse { IsSuccess = false, Message = "The admin account cannot be deleted." };

        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return new ServiceResponse { IsSuccess = true, Message = "User removed." };
    }

    protected async Task<List<HardwareModelDto>> GetProductsActionExecution() =>
        (await _modelRepo.GetAllAsync()).Select(m => new HardwareModelDto
        {
            Id = m.Id, Name = m.Name, Brand = m.Brand, Category = m.Category,
            Subtype = m.Subtype, Price = m.Price, PriceLabel = m.PriceLabel,
            ReleaseYear = m.ReleaseYear, PerformanceScore = m.PerformanceScore,
            EfficiencyScore = m.EfficiencyScore, ValueScore = m.ValueScore,
            Gradient = m.Gradient, Icon = m.Icon, Badge = m.Badge,
        }).ToList();
}
