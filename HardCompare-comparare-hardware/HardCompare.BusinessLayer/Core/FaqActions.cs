using HardCompare.DataAccessLayer.Repositories;
using HardCompare.Domain.Models.Faq;

namespace HardCompare.BusinessLayer.Core;

public class FaqActions
{
    private readonly FaqRepository _repo;

    public FaqActions(FaqRepository repo) => _repo = repo;

    protected async Task<List<FaqDto>> GetAllActionExecution() =>
        (await _repo.GetAllAsync()).Select(f => new FaqDto
        {
            Id = f.Id, Category = f.Category, Question = f.Question, Answer = f.Answer,
        }).ToList();
}
