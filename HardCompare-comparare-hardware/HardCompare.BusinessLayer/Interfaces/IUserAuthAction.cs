using HardCompare.Domain.Models.Service;
using HardCompare.Domain.Models.User;

namespace HardCompare.BusinessLayer.Interfaces;

public interface IUserAuthAction
{
    Task<ServiceResponse> RegisterAsync(UserCreateDto dto);
    Task<ServiceResponse> LoginAsync(UserLoginDto dto);
    Task<ServiceResponse> GetMeAsync(int userId);
    Task<ServiceResponse> UpdateMeAsync(int userId, UserUpdateDto dto);
}
