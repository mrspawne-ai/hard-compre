using HardCompare.Api.Models;

namespace HardCompare.Api.Services;

public interface IUserRepository
{
    List<User> GetAll();
    void Save(List<User> users);
}
