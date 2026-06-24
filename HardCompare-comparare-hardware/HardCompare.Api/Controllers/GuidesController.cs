using HardCompare.BusinessLayer;
using Microsoft.AspNetCore.Mvc;

namespace HardCompare.Api.Controllers;

[ApiController]
[Route("api/guides")]
public class GuidesController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var service = new BusinessLogic().GuideAction();
            return Ok(await service.GetAllAsync());
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while retrieving guides." });
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var service = new BusinessLogic().GuideAction();
            var guide = await service.GetByIdAsync(id);
            if (guide == null) return NotFound(new { error = "Guide not found." });
            return Ok(guide);
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while retrieving the guide." });
        }
    }
}
