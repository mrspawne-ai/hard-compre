using HardCompare.BusinessLayer.Core;
using HardCompare.BusinessLayer.Interfaces;
using HardCompare.DataAccessLayer.Repositories;
using HardCompare.Domain.Models.Faq;

namespace HardCompare.BusinessLayer.Structure;

public class FaqActionExecution : FaqActions, IFaqAction
{
    public FaqActionExecution(FaqRepository repo) : base(repo) { }

    public Task<List<FaqDto>> GetAllAsync() => GetAllActionExecution();
}
