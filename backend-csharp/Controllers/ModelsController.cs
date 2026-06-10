using HardCompare.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace HardCompare.Api.Controllers;

[ApiController]
[Route("api/models")]
public class ModelsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll([FromQuery] string? category)
    {
        var models = category != null
            ? SeedData.AllModels.Where(m => m.Category == category).ToList()
            : SeedData.AllModels;
        return Ok(models);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var model = SeedData.AllModels.FirstOrDefault(m => m.Id == id);
        if (model == null) return NotFound(new { error = "Model not found" });
        return Ok(model);
    }
}
