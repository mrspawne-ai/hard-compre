namespace HardCompare.Domain.Entities;

public class FaqEntity
{
    public int Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
}
