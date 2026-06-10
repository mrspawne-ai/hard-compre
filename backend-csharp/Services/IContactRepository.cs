using HardCompare.Api.Models;

namespace HardCompare.Api.Services;

public interface IContactRepository
{
    List<Contact> GetAll();
    void Save(List<Contact> contacts);
}
