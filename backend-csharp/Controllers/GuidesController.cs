using HardCompare.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace HardCompare.Api.Controllers;

[ApiController]
[Route("api/guides")]
public class GuidesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(SeedData.Guides);

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var guide = SeedData.Guides.FirstOrDefault(g => g.Id == id);
        if (guide == null) return NotFound(new { error = "Guide not found" });
        return Ok(guide);
    }
}
