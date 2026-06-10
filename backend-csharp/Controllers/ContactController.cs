using System.Text.RegularExpressions;
using HardCompare.Api.Models;
using HardCompare.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HardCompare.Api.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
    private readonly IContactRepository _contacts;
    public ContactController(IContactRepository contacts) => _contacts = contacts;

    [HttpPost]
    public IActionResult Submit([FromBody] ContactRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name) || string.IsNullOrWhiteSpace(req.Email) ||
            string.IsNullOrWhiteSpace(req.Message))
            return BadRequest(new { error = "Name, email, and message are required" });

        if (!Regex.IsMatch(req.Email, @"^[^\s@]+@[^\s@]+\.[^\s@]+$"))
            return BadRequest(new { error = "Invalid email address" });

        var entry = new Contact
        {
            Id = Guid.NewGuid().ToString(),
            Name = req.Name.Trim(),
            Email = req.Email.Trim(),
            Subject = req.Subject?.Trim() ?? string.Empty,
            Message = req.Message.Trim(),
            CreatedAt = DateTime.UtcNow.ToString("o"),
        };

        var all = _contacts.GetAll();
        all.Add(entry);
        _contacts.Save(all);

        return StatusCode(201, new { message = "Message received. We'll get back to you within one business day." });
    }
}

public record ContactRequest(string? Name, string? Email, string? Subject, string? Message);
