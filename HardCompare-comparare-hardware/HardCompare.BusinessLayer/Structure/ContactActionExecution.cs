using HardCompare.BusinessLayer.Core;
using HardCompare.BusinessLayer.Interfaces;
using HardCompare.DataAccessLayer.Repositories;
using HardCompare.Domain.Models.Contact;
using HardCompare.Domain.Models.Service;

namespace HardCompare.BusinessLayer.Structure;

public class ContactActionExecution : ContactActions, IContactAction
{
    public ContactActionExecution(ContactRepository repo) : base(repo) { }

    public Task<ServiceResponse> SubmitAsync(ContactCreateDto dto) => SubmitActionExecution(dto);
    public Task<List<ContactDto>> GetAllAsync() => GetAllActionExecution();
    public Task<bool> MarkResolvedAsync(int id) => MarkResolvedActionExecution(id);
}
