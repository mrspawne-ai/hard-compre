using HardCompare.BusinessLayer.Core;
using HardCompare.BusinessLayer.Interfaces;
using HardCompare.DataAccessLayer.Repositories;
using HardCompare.Domain.Models.Guide;

namespace HardCompare.BusinessLayer.Structure;

public class GuideActionExecution : GuideActions, IGuideAction
{
    public GuideActionExecution(GuideRepository repo) : base(repo) { }

    public Task<List<GuideDto>> GetAllAsync() => GetAllActionExecution();
    public Task<GuideDto?> GetByIdAsync(int id) => GetByIdActionExecution(id);
}
