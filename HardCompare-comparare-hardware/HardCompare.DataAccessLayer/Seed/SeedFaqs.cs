using HardCompare.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HardCompare.DataAccessLayer.Seed;

public static class SeedFaqs
{
    public static void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FaqEntity>().HasData(
            new FaqEntity { Id = 1, Category = "Comparing", Question = "How are performance scores calculated?", Answer = "Our scores are normalized across Geekbench 6 multi-core, Cinebench 2024, and real-world workload benchmarks. A score of 100 represents the highest-performing model in our database for that category. Scores are updated quarterly." },
            new FaqEntity { Id = 2, Category = "Comparing", Question = "Can I compare laptops with desktops?", Answer = "Yes — the Compare Tool supports mixing categories. However, scores like battery and portability are only shown for laptops. Component comparisons (CPU vs CPU) focus on compute-specific metrics." },
            new FaqEntity { Id = 3, Category = "Comparing", Question = "Why are Apple M5 efficiency scores so high?", Answer = "Apple M5 chips use a monolithic die with unified memory, eliminating the CPU-to-GPU data bus bottleneck. Combined with TSMC 3nm fabrication, they deliver exceptional performance-per-watt versus competing Intel and AMD laptop chips." },
            new FaqEntity { Id = 4, Category = "Pricing", Question = "Are prices accurate and up to date?", Answer = "Prices shown are manufacturer suggested retail prices (MSRP) at launch in USD. They may not reflect current retail pricing, regional taxes, or promotions. Always verify on the manufacturer's website before purchasing." },
            new FaqEntity { Id = 5, Category = "Pricing", Question = "Should I wait for the next generation?", Answer = "Generally, if a product was released in the last 6 months it represents current-gen value. Apple refreshes annually (M-series), while Intel and AMD tend to refresh every 12–18 months for laptop and desktop CPUs." },
            new FaqEntity { Id = 6, Category = "Technical", Question = "What is unified memory vs dedicated VRAM?", Answer = "Unified memory (Apple M-series) is shared between CPU and GPU at very high bandwidth (up to 800 GB/s on M5 Max). Dedicated VRAM (NVIDIA, AMD GPUs) is physically separate and only accessible by the GPU. Both approaches have trade-offs in GPU-intensive tasks." },
            new FaqEntity { Id = 7, Category = "Technical", Question = "What does TDP mean for laptops?", Answer = "Thermal Design Power (TDP) is the maximum power a processor is designed to consume under sustained load. Lower TDP means cooler, quieter operation but may limit peak performance. Laptops typically run chips at reduced TDP (15–45W) vs desktop variants (65–125W+)." },
            new FaqEntity { Id = 8, Category = "Technical", Question = "Is OLED better than Mini-LED for laptops?", Answer = "OLED offers perfect blacks, infinite contrast, and faster response times — ideal for media and color work. Mini-LED (like Apple's Liquid Retina XDR) is brighter, has no risk of burn-in, and better for sustained work in bright environments. Both are premium options." },
            new FaqEntity { Id = 9, Category = "Platform", Question = "Which is better for software development: Mac or PC?", Answer = "Both are excellent. Macs run native Unix (macOS/Darwin), which aligns well with Linux servers, and Apple silicon performance is outstanding. Windows offers WSL2 (Windows Subsystem for Linux) for a similar Unix experience plus wider hardware choice. Many developers prefer Mac for the terminal experience." },
            new FaqEntity { Id = 10, Category = "Platform", Question = "Can Macs run Windows or gaming?", Answer = "Yes, via Parallels virtualization (not native Boot Camp since M-series). Gaming on Mac is improving with Metal API and Apple's game porting toolkit, but the Windows/DirectX gaming library is vastly larger. Dedicated gaming laptops (ASUS ROG, Razer) remain superior for gaming." }
        );
    }
}
