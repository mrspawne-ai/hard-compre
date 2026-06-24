using HardCompare.BusinessLayer.Core;
using HardCompare.BusinessLayer.Interfaces;
using HardCompare.DataAccessLayer.Repositories;
using HardCompare.Domain.Models.Hardware;

namespace HardCompare.BusinessLayer.Structure;

public class HardwareModelActionExecution : HardwareModelActions, IHardwareModelAction
{
    public HardwareModelActionExecution(HardwareModelRepository repo) : base(repo) { }

    public Task<List<HardwareModelDto>> GetAllAsync(string? category) => GetAllActionExecution(category);
    public Task<HardwareModelDto?> GetByIdAsync(string id) => GetByIdActionExecution(id);
    public Task<List<HardwareModelDto>> GetByIdsAsync(List<string> ids) => GetByIdsActionExecution(ids);
    public Task AddAsync(HardwareModelDto dto) => AddActionExecution(dto);
    public Task UpdateAsync(HardwareModelDto dto) => UpdateActionExecution(dto);
    public Task DeleteAsync(string id) => DeleteActionExecution(id);
}
