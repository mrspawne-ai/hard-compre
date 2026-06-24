using HardCompare.DataAccessLayer.Repositories;
using HardCompare.Domain.Entities;
using HardCompare.Domain.Models.Guide;

namespace HardCompare.BusinessLayer.Core;

public class GuideActions
{
    private readonly GuideRepository _repo;

    public GuideActions(GuideRepository repo) => _repo = repo;

    private static GuideDto ToDto(GuideEntity g) => new()
    {
        Id = g.Id, Title = g.Title, Excerpt = g.Excerpt, Category = g.Category,
        ReadTime = g.ReadTime, Gradient = g.Gradient, Icon = g.Icon,
        PublishDate = g.PublishDate, Highlights = g.Highlights.ToList(),
    };

    protected async Task<List<GuideDto>> GetAllActionExecution() =>
        (await _repo.GetAllAsync()).Select(ToDto).ToList();

    protected async Task<GuideDto?> GetByIdActionExecution(int id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e == null ? null : ToDto(e);
    }
}
