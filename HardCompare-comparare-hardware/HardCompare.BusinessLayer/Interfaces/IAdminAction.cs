using HardCompare.Domain.Models.Hardware;
using HardCompare.Domain.Models.Service;
using HardCompare.Domain.Models.User;

namespace HardCompare.BusinessLayer.Interfaces;

public interface IAdminAction
{
    Task<object> GetStatsAsync();
    Task<List<UserInfoDto>> GetUsersAsync(string? q);
    Task<ServiceResponse> UpdateUserAsync(int id, AdminUpdateUserDto dto);
    Task<ServiceResponse> DeleteUserAsync(int id);
    Task<List<HardwareModelDto>> GetProductsAsync();
}
