using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HardCompare.BusinessLayer;
using HardCompare.BusinessLayer.Interfaces;
using HardCompare.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace HardCompare.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserAuthAction _userAuth = new BusinessLogic().UserAuthAction();

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] UserCreateDto dto)
    {
        try
        {
            var result = await _userAuth.RegisterAsync(dto);
            if (!result.IsSuccess)
                return Conflict(new { error = result.Message });
            var user = (UserInfoDto)result.Data!;
            return StatusCode(201, new { user, token = GenerateToken(user) });
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred during registration." });
        }
    }

    [HttpPost("signin")]
    public async Task<IActionResult> Signin([FromBody] UserLoginDto dto)
    {
        try
        {
            var result = await _userAuth.LoginAsync(dto);
            if (!result.IsSuccess)
                return Unauthorized(new { error = result.Message });
            var user = (UserInfoDto)result.Data!;
            return Ok(new { user, token = GenerateToken(user) });
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred during sign in." });
        }
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            var result = await _userAuth.GetMeAsync(id);
            if (!result.IsSuccess) return NotFound(new { error = result.Message });
            return Ok(result.Data);
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred." });
        }
    }

    [Authorize]
    [HttpPatch("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UserUpdateDto dto)
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            var result = await _userAuth.UpdateMeAsync(id, dto);
            if (!result.IsSuccess)
            {
                if (result.Message == "User not found.") return NotFound(new { error = result.Message });
                if (result.Message?.Contains("Email") == true) return Conflict(new { error = result.Message });
                return StatusCode(403, new { error = result.Message });
            }
            return Ok(result.Data);
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred." });
        }
    }

    private static string GenerateToken(UserInfoDto user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppConfig.JwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        // Role in JWT must match [Authorize(Roles = "Admin")] → capitalize first letter
        var jwtRole = user.Role.Length > 0
            ? char.ToUpperInvariant(user.Role[0]) + user.Role[1..]
            : "User";

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, jwtRole),
        };
        var token = new JwtSecurityToken(
            issuer: AppConfig.JwtIssuer,
            audience: AppConfig.JwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
