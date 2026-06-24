using HardCompare.DataAccessLayer.Repositories;
using HardCompare.Domain.Entities;
using HardCompare.Domain.Models.Hardware;

namespace HardCompare.BusinessLayer.Core;

public class HardwareModelActions
{
    private readonly HardwareModelRepository _repo;

    public HardwareModelActions(HardwareModelRepository repo) => _repo = repo;

    private static HardwareModelDto ToDto(HardwareModelEntity m) => new()
    {
        Id = m.Id, Name = m.Name, Brand = m.Brand, Category = m.Category, Subtype = m.Subtype,
        Price = m.Price, PriceLabel = m.PriceLabel, Os = m.Os, ReleaseYear = m.ReleaseYear,
        Cpu = m.Cpu, CpuCores = m.CpuCores, Gpu = m.Gpu, GpuVram = m.GpuVram,
        Ram = m.Ram, RamType = m.RamType, Storage = m.Storage, Display = m.Display,
        Resolution = m.Resolution, RefreshRate = m.RefreshRate, PanelType = m.PanelType,
        Battery = m.Battery, Weight = m.Weight, Ports = m.Ports, Webcam = m.Webcam,
        PerformanceScore = m.PerformanceScore, EfficiencyScore = m.EfficiencyScore,
        ValueScore = m.ValueScore, BatteryScore = m.BatteryScore,
        Gradient = m.Gradient, Icon = m.Icon, Badge = m.Badge,
    };

    private static HardwareModelEntity ToEntity(HardwareModelDto d) => new()
    {
        Id = d.Id, Name = d.Name, Brand = d.Brand, Category = d.Category, Subtype = d.Subtype,
        Price = d.Price, PriceLabel = d.PriceLabel, Os = d.Os, ReleaseYear = d.ReleaseYear,
        Cpu = d.Cpu, CpuCores = d.CpuCores, Gpu = d.Gpu, GpuVram = d.GpuVram,
        Ram = d.Ram, RamType = d.RamType, Storage = d.Storage, Display = d.Display,
        Resolution = d.Resolution, RefreshRate = d.RefreshRate, PanelType = d.PanelType,
        Battery = d.Battery, Weight = d.Weight, Ports = d.Ports, Webcam = d.Webcam,
        PerformanceScore = d.PerformanceScore, EfficiencyScore = d.EfficiencyScore,
        ValueScore = d.ValueScore, BatteryScore = d.BatteryScore,
        Gradient = d.Gradient, Icon = d.Icon, Badge = d.Badge,
    };

    protected async Task<List<HardwareModelDto>> GetAllActionExecution(string? category) =>
        (await _repo.GetAllAsync(category)).Select(ToDto).ToList();

    protected async Task<HardwareModelDto?> GetByIdActionExecution(string id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e == null ? null : ToDto(e);
    }

    protected async Task<List<HardwareModelDto>> GetByIdsActionExecution(List<string> ids) =>
        (await _repo.GetByIdsAsync(ids)).Select(ToDto).ToList();

    protected Task AddActionExecution(HardwareModelDto dto) => _repo.AddAsync(ToEntity(dto));
    protected Task UpdateActionExecution(HardwareModelDto dto) => _repo.UpdateAsync(ToEntity(dto));
    protected Task DeleteActionExecution(string id) => _repo.DeleteAsync(id);
}
