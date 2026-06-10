using HardCompare.Api.Data;
using HardCompare.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HardCompare.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly IUserRepository _users;
    private readonly IContactRepository _contacts;

    public AdminController(IUserRepository users, IContactRepository contacts)
    {
        _users = users;
        _contacts = contacts;
    }

    [HttpGet("stats")]
    public IActionResult Stats()
    {
        var users = _users.GetAll();
        var regular = users.Where(u => u.Role != "admin").ToList();
        var contacts = _contacts.GetAll();
        var monthAgo = DateTime.UtcNow.AddMonths(-1);

        return Ok(new
        {
            totalUsers = regular.Count,
            activeUsers = regular.Count(u => u.Status == "active"),
            newUsersThisMonth = regular.Count(u =>
                DateTime.TryParse(u.CreatedAt, out var d) && d > monthAgo),
            totalModels = SeedData.AllModels.Count,
            totalContacts = contacts.Count,
            pendingContacts = contacts.Count(c => c.Resolved != true),
        });
    }

    [HttpGet("users")]
    public IActionResult GetUsers([FromQuery] string? q)
    {
        var users = _users.GetAll()
            .Where(u => u.Role != "admin")
            .Select(u => u.Safe)
            .ToList();

        if (!string.IsNullOrEmpty(q))
        {
            var lower = q.ToLower();
            users = users.Where(u =>
                u.Name.ToLower().Contains(lower) || u.Email.ToLower().Contains(lower)).ToList();
        }

        return Ok(users);
    }

    [HttpPatch("users/{id}")]
    public IActionResult UpdateUser(string id, [FromBody] AdminUpdateUserRequest req)
    {
        var users = _users.GetAll();
        var idx = users.FindIndex(u => u.Id == id);
        if (idx == -1) return NotFound(new { error = "User not found" });

        if (users[idx].Role == "admin")
            return StatusCode(403, new { error = "The admin account cannot be modified here" });

        if (!string.IsNullOrEmpty(req.Name)) users[idx].Name = req.Name;
        if (!string.IsNullOrEmpty(req.Email)) users[idx].Email = req.Email;
        if (!string.IsNullOrEmpty(req.Status)) users[idx].Status = req.Status;

        _users.Save(users);
        return Ok(users[idx].Safe);
    }

    [HttpDelete("users/{id}")]
    public IActionResult DeleteUser(string id)
    {
        var users = _users.GetAll();
        var target = users.FirstOrDefault(u => u.Id == id);
        if (target == null) return NotFound(new { error = "User not found" });

        if (target.Role == "admin")
            return StatusCode(403, new { error = "The admin account cannot be deleted" });

        _users.Save(users.Where(u => u.Id != id).ToList());
        return Ok(new { message = "User removed" });
    }

    [HttpGet("products")]
    public IActionResult GetProducts() => Ok(SeedData.AllModels.Select(m => new
    {
        id = m.Id,
        name = m.Name,
        brand = m.Brand,
        category = m.Category,
        subtype = m.Subtype,
        price = m.Price,
        priceLabel = m.PriceLabel,
        releaseYear = m.ReleaseYear,
        performanceScore = m.PerformanceScore,
        status = "active",
    }));

    [HttpGet("contacts")]
    public IActionResult GetContacts() => Ok(_contacts.GetAll());
}

public record AdminUpdateUserRequest(string? Name, string? Email, string? Status);
