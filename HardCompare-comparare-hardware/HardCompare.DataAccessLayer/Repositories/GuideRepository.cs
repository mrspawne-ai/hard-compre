using HardCompare.DataAccessLayer.Context;
using HardCompare.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HardCompare.DataAccessLayer.Repositories;

public class GuideRepository
{
    private readonly HardCompareDbContext _db;

    public GuideRepository(HardCompareDbContext db) => _db = db;

    public async Task<List<GuideEntity>> GetAllAsync() =>
        await _db.Guides.OrderBy(g => g.Id).ToListAsync();

    public async Task<GuideEntity?> GetByIdAsync(int id) =>
        await _db.Guides.FirstOrDefaultAsync(g => g.Id == id);
}
