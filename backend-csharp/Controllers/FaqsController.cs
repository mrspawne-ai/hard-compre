using HardCompare.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace HardCompare.Api.Controllers;

[ApiController]
[Route("api/faqs")]
public class FaqsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(SeedData.Faqs);
}
