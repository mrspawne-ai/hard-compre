using HardCompare.Domain.Models.Guide;

namespace HardCompare.BusinessLayer.Interfaces;

public interface IGuideAction
{
    Task<List<GuideDto>> GetAllAsync();
    Task<GuideDto?> GetByIdAsync(int id);
}
