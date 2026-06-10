using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HardCompare.Api.Infrastructure;
using HardCompare.Api.Models;
using HardCompare.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace HardCompare.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private const string AdminEmail = "admin@hardcompare.com";

    private readonly IUserRepository _users;
    private readonly JwtConfig _jwt;

    public AuthController(IUserRepository users, JwtConfig jwt)
    {
        _users = users;
        _jwt = jwt;
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
        };
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest req)
    {
        if (string.IsNullOrEmpty(req.Email) || string.IsNullOrEmpty(req.Password))
            return BadRequest(new { error = "Email and password are required" });
        if (req.Password.Length < 6)
            return BadRequest(new { error = "Password must be at least 6 characters" });

        if (req.Email.ToLower() == AdminEmail)
            return Conflict(new { error = "Email already registered" });

        var users = _users.GetAll();
        if (users.Any(u => u.Email.ToLower() == req.Email.ToLower()))
            return Conflict(new { error = "Email already registered" });

        var hash = await Task.Run(() => BCrypt.Net.BCrypt.HashPassword(req.Password, 10));
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = !string.IsNullOrWhiteSpace(req.Name) ? req.Name.Trim() : req.Email.Split('@')[0],
            Email = req.Email.ToLower(),
            PasswordHash = hash,
            Role = "user",
            Plan = "Free",
            JoinDate = DateTime.Now.ToString("MMMM yyyy"),
            Status = "active",
            CreatedAt = DateTime.UtcNow.ToString("o"),
        };

        _users.Save([.. users, user]);
        return StatusCode(201, new { user = user.Safe, token = GenerateToken(user) });
    }

    [HttpPost("signin")]
    public async Task<IActionResult> Signin([FromBody] SigninRequest req)
    {
        if (string.IsNullOrEmpty(req.Email) || string.IsNullOrEmpty(req.Password))
            return BadRequest(new { error = "Email and password are required" });

        var users = _users.GetAll();
        var user = users.FirstOrDefault(u => u.Email.ToLower() == req.Email.ToLower());

        var valid = user != null &&
            await Task.Run(() => BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash));

        if (!valid)
            return Unauthorized(new { error = "Invalid email or password" });

        return Ok(new { user = user!.Safe, token = GenerateToken(user) });
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult GetMe()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = _users.GetAll().FirstOrDefault(u => u.Id == id);
        if (user == null) return NotFound(new { error = "User not found" });
        return Ok(user.Safe);
    }

    [Authorize]
    [HttpPatch("me")]
    public IActionResult UpdateMe([FromBody] UpdateMeRequest req)
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var users = _users.GetAll();
        var idx = users.FindIndex(u => u.Id == id);
        if (idx == -1) return NotFound(new { error = "User not found" });

        if (users[idx].Role == "admin" && !string.IsNullOrEmpty(req.Email) &&
            req.Email.ToLower() != AdminEmail)
            return StatusCode(403, new { error = "Admin email address cannot be changed" });

        if (!string.IsNullOrEmpty(req.Email) && req.Email.ToLower() != users[idx].Email)
        {
            if (users.Any(u => u.Email.ToLower() == req.Email.ToLower() && u.Id != id))
                return Conflict(new { error = "Email already in use" });
        }

        if (!string.IsNullOrWhiteSpace(req.Name))
            users[idx].Name = req.Name.Trim();
        if (!string.IsNullOrEmpty(req.Email) && users[idx].Role != "admin")
            users[idx].Email = req.Email.ToLower();

        _users.Save(users);
        return Ok(users[idx].Safe);
    }
}

public record SignupRequest(string? Name, string? Email, string? Password);
public record SigninRequest(string? Email, string? Password);
public record UpdateMeRequest(string? Name, string? Email);
