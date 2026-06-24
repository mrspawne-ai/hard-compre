using System.Text.RegularExpressions;
using HardCompare.DataAccessLayer.Repositories;
using HardCompare.Domain.Entities;
using HardCompare.Domain.Models.Contact;
using HardCompare.Domain.Models.Service;

namespace HardCompare.BusinessLayer.Core;

public class ContactActions
{
    private readonly ContactRepository _repo;

    public ContactActions(ContactRepository repo) => _repo = repo;

    protected async Task<ServiceResponse> SubmitActionExecution(ContactCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Message))
            return new ServiceResponse { IsSuccess = false, Message = "Name, email, and message are required." };

        if (!Regex.IsMatch(dto.Email, @"^[^\s@]+@[^\s@]+\.[^\s@]+$"))
            return new ServiceResponse { IsSuccess = false, Message = "Invalid email address." };

        await _repo.AddAsync(new ContactEntity
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim(),
            Subject = dto.Subject?.Trim() ?? string.Empty,
            Message = dto.Message.Trim(),
            CreatedAt = DateTime.UtcNow,
            Resolved = false,
        });

        return new ServiceResponse { IsSuccess = true, Message = "Message received. We'll get back to you within one business day." };
    }

    protected async Task<List<ContactDto>> GetAllActionExecution() =>
        (await _repo.GetAllAsync()).Select(c => new ContactDto
        {
            Id = c.Id, Name = c.Name, Email = c.Email,
            Subject = c.Subject, Message = c.Message,
            CreatedAt = c.CreatedAt, Resolved = c.Resolved,
        }).ToList();

    protected Task<bool> MarkResolvedActionExecution(int id) => _repo.MarkResolvedAsync(id);
}
