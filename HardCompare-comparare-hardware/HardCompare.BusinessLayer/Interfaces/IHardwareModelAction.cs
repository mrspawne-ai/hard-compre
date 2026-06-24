using HardCompare.Domain.Models.Hardware;

namespace HardCompare.BusinessLayer.Interfaces;

public interface IHardwareModelAction
{
    Task<List<HardwareModelDto>> GetAllAsync(string? category);
    Task<HardwareModelDto?> GetByIdAsync(string id);
    Task<List<HardwareModelDto>> GetByIdsAsync(List<string> ids);
    Task AddAsync(HardwareModelDto dto);
    Task UpdateAsync(HardwareModelDto dto);
    Task DeleteAsync(string id);
}
