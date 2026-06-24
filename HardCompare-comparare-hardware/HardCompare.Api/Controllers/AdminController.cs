using HardCompare.BusinessLayer;
using HardCompare.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HardCompare.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        try
        {
            var service = new BusinessLogic().AdminAction();
            return Ok(await service.GetStatsAsync());
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while retrieving stats." });
        }
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] string? q)
    {
        try
        {
            var service = new BusinessLogic().AdminAction();
            return Ok(await service.GetUsersAsync(q));
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while retrieving users." });
        }
    }

    [HttpPatch("users/{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] AdminUpdateUserDto dto)
    {
        try
        {
            var service = new BusinessLogic().AdminAction();
            var result = await service.UpdateUserAsync(id, dto);
            if (!result.IsSuccess)
            {
                if (result.Message == "User not found.") return NotFound(new { error = result.Message });
                return StatusCode(403, new { error = result.Message });
            }
            return Ok(result.Data);
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while updating the user." });
        }
    }

    [HttpDelete("users/{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            var service = new BusinessLogic().AdminAction();
            var result = await service.DeleteUserAsync(id);
            if (!result.IsSuccess)
            {
                if (result.Message == "User not found.") return NotFound(new { error = result.Message });
                return StatusCode(403, new { error = result.Message });
            }
            return Ok(new { message = result.Message });
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while deleting the user." });
        }
    }

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts()
    {
        try
        {
            var service = new BusinessLogic().AdminAction();
            return Ok(await service.GetProductsAsync());
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while retrieving products." });
        }
    }

    [HttpGet("contacts")]
    public async Task<IActionResult> GetContacts()
    {
        try
        {
            var service = new BusinessLogic().ContactAction();
            return Ok(await service.GetAllAsync());
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while retrieving contacts." });
        }
    }

    [HttpPatch("contacts/{id:int}/resolve")]
    public async Task<IActionResult> ResolveContact(int id)
    {
        try
        {
            var service = new BusinessLogic().ContactAction();
            var resolved = await service.MarkResolvedAsync(id);
            if (!resolved) return NotFound(new { error = "Contact not found." });
            return Ok(new { message = "Contact marked as resolved." });
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred." });
        }
    }
}
