using HardCompare.BusinessLayer.Core;
using HardCompare.BusinessLayer.Interfaces;
using HardCompare.Domain.Models.Service;
using HardCompare.Domain.Models.User;

namespace HardCompare.BusinessLayer.Structure;

public class UserAuthActionExecution : UserAuthActions, IUserAuthAction
{
    public Task<ServiceResponse> RegisterAsync(UserCreateDto dto) => RegisterActionExecution(dto);
    public Task<ServiceResponse> LoginAsync(UserLoginDto dto) => LoginActionExecution(dto);
    public Task<ServiceResponse> GetMeAsync(int userId) => GetMeActionExecution(userId);
    public Task<ServiceResponse> UpdateMeAsync(int userId, UserUpdateDto dto) => UpdateMeActionExecution(userId, dto);
}
