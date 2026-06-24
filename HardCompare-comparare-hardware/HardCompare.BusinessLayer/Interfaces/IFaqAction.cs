using HardCompare.Domain.Models.Faq;

namespace HardCompare.BusinessLayer.Interfaces;

public interface IFaqAction
{
    Task<List<FaqDto>> GetAllAsync();
}
