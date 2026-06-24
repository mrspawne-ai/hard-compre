using HardCompare.BusinessLayer;
using HardCompare.Domain.Models.Hardware;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HardCompare.Api.Controllers;

[ApiController]
[Route("api/models")]
public class ModelsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category)
    {
        try
        {
            var service = new BusinessLogic().HardwareModelAction();
            return Ok(await service.GetAllAsync(category));
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while retrieving models." });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        try
        {
            var service = new BusinessLogic().HardwareModelAction();
            var model = await service.GetByIdAsync(id);
            if (model == null) return NotFound(new { error = "Model not found." });
            return Ok(model);
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while retrieving the model." });
        }
    }

    [HttpGet("compare")]
    public async Task<IActionResult> Compare([FromQuery] string ids)
    {
        var idList = ids.Split(',').Select(s => s.Trim()).Where(s => !string.IsNullOrEmpty(s)).ToList();
        if (idList.Count == 0)
            return BadRequest(new { error = "At least one model id is required." });
        try
        {
            var service = new BusinessLogic().HardwareModelAction();
            return Ok(await service.GetByIdsAsync(idList));
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while comparing models." });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Add([FromBody] HardwareModelDto dto)
    {
        try
        {
            var service = new BusinessLogic().HardwareModelAction();
            await service.AddAsync(dto);
            return StatusCode(201);
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while adding the model." });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] HardwareModelDto dto)
    {
        try
        {
            dto.Id = id;
            var service = new BusinessLogic().HardwareModelAction();
            var existing = await service.GetByIdAsync(id);
            if (existing == null) return NotFound(new { error = "Model not found." });
            await service.UpdateAsync(dto);
            return NoContent();
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while updating the model." });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var service = new BusinessLogic().HardwareModelAction();
            var existing = await service.GetByIdAsync(id);
            if (existing == null) return NotFound(new { error = "Model not found." });
            await service.DeleteAsync(id);
            return NoContent();
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while deleting the model." });
        }
    }
}
