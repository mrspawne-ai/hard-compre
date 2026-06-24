using HardCompare.Domain.Models.Contact;
using HardCompare.Domain.Models.Service;

namespace HardCompare.BusinessLayer.Interfaces;

public interface IContactAction
{
    Task<ServiceResponse> SubmitAsync(ContactCreateDto dto);
    Task<List<ContactDto>> GetAllAsync();
    Task<bool> MarkResolvedAsync(int id);
}
