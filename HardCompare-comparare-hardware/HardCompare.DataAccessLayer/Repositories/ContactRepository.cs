using HardCompare.DataAccessLayer.Context;
using HardCompare.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HardCompare.DataAccessLayer.Repositories;

public class ContactRepository
{
    private readonly HardCompareDbContext _db;

    public ContactRepository(HardCompareDbContext db) => _db = db;

    public async Task<List<ContactEntity>> GetAllAsync() =>
        await _db.Contacts.OrderByDescending(c => c.CreatedAt).ToListAsync();

    public async Task AddAsync(ContactEntity contact)
    {
        await _db.Contacts.AddAsync(contact);
        await _db.SaveChangesAsync();
    }

    public async Task<bool> MarkResolvedAsync(int id)
    {
        var contact = await _db.Contacts.FirstOrDefaultAsync(c => c.Id == id);
        if (contact == null) return false;
        contact.Resolved = true;
        await _db.SaveChangesAsync();
        return true;
    }
}
