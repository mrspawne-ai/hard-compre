namespace HardCompare.Domain.Entities;

public class HardwareModelEntity
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Subtype { get; set; } = string.Empty;
    public int Price { get; set; }
    public string PriceLabel { get; set; } = string.Empty;
    public string? Os { get; set; }
    public int ReleaseYear { get; set; }
    public string? Cpu { get; set; }
    public string? CpuCores { get; set; }
    public string? Gpu { get; set; }
    public string? GpuVram { get; set; }
    public string? Ram { get; set; }
    public string? RamType { get; set; }
    public string? Storage { get; set; }
    public string? Display { get; set; }
    public string? Resolution { get; set; }
    public string? RefreshRate { get; set; }
    public string? PanelType { get; set; }
    public string? Battery { get; set; }
    public string? Weight { get; set; }
    public string? Ports { get; set; }
    public string? Webcam { get; set; }
    public int PerformanceScore { get; set; }
    public int EfficiencyScore { get; set; }
    public int ValueScore { get; set; }
    public int? BatteryScore { get; set; }
    public string Gradient { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string? Badge { get; set; }
}
