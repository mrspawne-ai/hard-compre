using HardCompare.DataAccessLayer.Context;
using HardCompare.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HardCompare.DataAccessLayer.Repositories;

public class HardwareModelRepository
{
    private readonly HardCompareDbContext _db;

    public HardwareModelRepository(HardCompareDbContext db) => _db = db;

    public async Task<List<HardwareModelEntity>> GetAllAsync(string? category = null)
    {
        var query = _db.HardwareModels.AsQueryable();
        if (category != null)
            query = query.Where(m => m.Category == category);
        return await query.ToListAsync();
    }

    public async Task<HardwareModelEntity?> GetByIdAsync(string id) =>
        await _db.HardwareModels.FirstOrDefaultAsync(m => m.Id == id);

    public async Task<List<HardwareModelEntity>> GetByIdsAsync(List<string> ids) =>
        await _db.HardwareModels.Where(m => ids.Contains(m.Id)).ToListAsync();

    public async Task AddAsync(HardwareModelEntity model)
    {
        await _db.HardwareModels.AddAsync(model);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(HardwareModelEntity model)
    {
        var existing = await _db.HardwareModels.FirstOrDefaultAsync(m => m.Id == model.Id);
        if (existing == null) return;
        _db.Entry(existing).CurrentValues.SetValues(model);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(string id)
    {
        var model = await _db.HardwareModels.FirstOrDefaultAsync(m => m.Id == id);
        if (model == null) return;
        _db.HardwareModels.Remove(model);
        await _db.SaveChangesAsync();
    }
}
