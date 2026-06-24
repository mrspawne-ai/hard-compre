using HardCompare.BusinessLayer;
using HardCompare.Domain.Models.Contact;
using Microsoft.AspNetCore.Mvc;

namespace HardCompare.Api.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] ContactCreateDto dto)
    {
        try
        {
            var service = new BusinessLogic().ContactAction();
            var result = await service.SubmitAsync(dto);
            if (!result.IsSuccess)
                return BadRequest(new { error = result.Message });
            return StatusCode(201, new { message = result.Message });
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred." });
        }
    }
}
