using HardCompare.BusinessLayer.Core;
using HardCompare.BusinessLayer.Interfaces;
using HardCompare.DataAccessLayer.Repositories;
using HardCompare.Domain.Models.Hardware;
using HardCompare.Domain.Models.Service;
using HardCompare.Domain.Models.User;

namespace HardCompare.BusinessLayer.Structure;

public class AdminActionExecution : AdminActions, IAdminAction
{
    public AdminActionExecution(HardwareModelRepository modelRepo) : base(modelRepo) { }

    public Task<object> GetStatsAsync() => GetStatsActionExecution();
    public Task<List<UserInfoDto>> GetUsersAsync(string? q) => GetUsersActionExecution(q);
    public Task<ServiceResponse> UpdateUserAsync(int id, AdminUpdateUserDto dto) => UpdateUserActionExecution(id, dto);
    public Task<ServiceResponse> DeleteUserAsync(int id) => DeleteUserActionExecution(id);
    public Task<List<HardwareModelDto>> GetProductsAsync() => GetProductsActionExecution();
}
