namespace HardCompare.Domain.Models.Guide;

public class GuideDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ReadTime { get; set; } = string.Empty;
    public string Gradient { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string PublishDate { get; set; } = string.Empty;
    public List<string> Highlights { get; set; } = new();
}
