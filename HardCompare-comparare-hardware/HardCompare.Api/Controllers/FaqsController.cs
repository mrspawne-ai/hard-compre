using HardCompare.BusinessLayer;
using Microsoft.AspNetCore.Mvc;

namespace HardCompare.Api.Controllers;

[ApiController]
[Route("api/faqs")]
public class FaqsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var service = new BusinessLogic().FaqAction();
            return Ok(await service.GetAllAsync());
        }
        catch
        {
            return StatusCode(500, new { error = "An error occurred while retrieving FAQs." });
        }
    }
}
