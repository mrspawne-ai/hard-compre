using HardCompare.DataAccessLayer.Context;
using HardCompare.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HardCompare.DataAccessLayer.Repositories;

public class UserRepository
{
    private readonly HardCompareDbContext _db;

    public UserRepository(HardCompareDbContext db) => _db = db;

    public async Task<List<UserEntity>> GetAllAsync() =>
        await _db.Users.ToListAsync();

    public async Task<UserEntity?> GetByIdAsync(int id) =>
        await _db.Users.FirstOrDefaultAsync(u => u.Id == id);

    public async Task<UserEntity?> GetByEmailAsync(string email) =>
        await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task AddAsync(UserEntity user)
    {
        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(UserEntity user)
    {
        _db.Users.Update(user);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return;
        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
    }
}
