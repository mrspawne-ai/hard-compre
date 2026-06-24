using HardCompare.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HardCompare.DataAccessLayer.Seed;

public static class SeedGuides
{
    public static void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GuideEntity>().HasData(
            new GuideEntity
            {
                Id = 1, Title = "Best Laptop for Programming in 2026",
                Excerpt = "From Apple silicon to Snapdragon X Elite, we break down the top picks for software developers who demand speed, battery, and great displays.",
                Category = "Buying Guide", ReadTime = "8 min",
                Gradient = "from-blue-400/25 to-indigo-600/35", Icon = "👨‍💻", PublishDate = "Mar 5, 2026",
                Highlights = ["M5 Pro crushes compile times", "ThinkPad X1 for Linux lovers", "Surface Laptop 7 for .NET developers"],
            },
            new GuideEntity
            {
                Id = 2, Title = "GPU Buying Guide 2026: RTX 5000 vs AMD RX 9000",
                Excerpt = "NVIDIA raised the bar with RTX 5090, but AMD fights back with value. This guide helps you choose the right GPU for gaming, AI, or creative work.",
                Category = "GPU Guide", ReadTime = "10 min",
                Gradient = "from-green-400/25 to-emerald-700/35", Icon = "🎮", PublishDate = "Feb 20, 2026",
                Highlights = ["RTX 5090 is unmatched for 4K gaming", "RX 9070 XT is the value king", "RTX 5080 hits the sweet spot"],
            },
            new GuideEntity
            {
                Id = 3, Title = "Mac vs PC in 2026: A Fair Comparison",
                Excerpt = "We test and compare Apple silicon Macs against the best Windows laptops across performance, battery life, software, and total cost of ownership.",
                Category = "Comparison", ReadTime = "12 min",
                Gradient = "from-purple-400/25 to-pink-600/35", Icon = "⚖", PublishDate = "Jan 30, 2026",
                Highlights = ["M5 Max beats everything in efficiency", "Windows wins for gaming", "macOS still leads for creative pros"],
            },
            new GuideEntity
            {
                Id = 4, Title = "How to Read Laptop Specs (2026 Edition)",
                Excerpt = "TDP, LPDDR5X, ProMotion, unified memory — we demystify the jargon so you can make an informed decision without a computer science degree.",
                Category = "Beginner", ReadTime = "6 min",
                Gradient = "from-amber-400/25 to-orange-600/35", Icon = "📖", PublishDate = "Jan 10, 2026",
                Highlights = ["What \"efficiency cores\" actually mean", "Unified vs dedicated VRAM", "Why refresh rate matters for you"],
            },
            new GuideEntity
            {
                Id = 5, Title = "Best Budget Gaming Laptops 2026 (Under $2,000)",
                Excerpt = "You don't need to spend $4,500 for great gaming. The ASUS ROG Zephyrus G14 and others deliver RTX 5080 performance at sane prices.",
                Category = "Budget Guide", ReadTime = "7 min",
                Gradient = "from-red-400/25 to-rose-700/35", Icon = "💰", PublishDate = "Dec 15, 2025",
                Highlights = ["G14 is the pick at $2,499", "OLED panels at this price are wild", "Battery life trade-offs to know"],
            }
        );
    }
}
