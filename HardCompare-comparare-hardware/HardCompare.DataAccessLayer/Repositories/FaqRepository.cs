using HardCompare.DataAccessLayer.Context;
using HardCompare.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HardCompare.DataAccessLayer.Repositories;

public class FaqRepository
{
    private readonly HardCompareDbContext _db;

    public FaqRepository(HardCompareDbContext db) => _db = db;

    public async Task<List<FaqEntity>> GetAllAsync() =>
        await _db.Faqs.OrderBy(f => f.Id).ToListAsync();
}
