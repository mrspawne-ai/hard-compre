using Microsoft.EntityFrameworkCore;
using HardCompare.Domain.Entities;
using HardCompare.DataAccessLayer.Seed;

namespace HardCompare.DataAccessLayer.Context;

public class HardCompareDbContext : DbContext
{
    public HardCompareDbContext() { }

    public HardCompareDbContext(DbContextOptions<HardCompareDbContext> options) : base(options) { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured && !string.IsNullOrEmpty(DbConfig.ConnectionString))
            optionsBuilder.UseNpgsql(DbConfig.ConnectionString);
    }

    public DbSet<UserEntity> Users { get; set; }
    public DbSet<HardwareModelEntity> HardwareModels { get; set; }
    public DbSet<ContactEntity> Contacts { get; set; }
    public DbSet<FaqEntity> Faqs { get; set; }
    public DbSet<GuideEntity> Guides { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserEntity>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<HardwareModelEntity>()
            .HasKey(h => h.Id);
        modelBuilder.Entity<HardwareModelEntity>()
            .Property(h => h.Id)
            .ValueGeneratedNever();

        SeedHardwareModels.Seed(modelBuilder);
        SeedFaqs.Seed(modelBuilder);
        SeedGuides.Seed(modelBuilder);
    }
}
