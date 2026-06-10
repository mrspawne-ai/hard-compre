using HardCompare.Api.Models;

namespace HardCompare.Api.Data;

public static class SeedData
{
    public static readonly List<HardwareModel> AllModels =
    [
        // ── LAPTOPS ──────────────────────────────────────────────────────────
        new()
        {
            Id = "mba13-m5", Name = "MacBook Air 13\" M5",
            Brand = "Apple", Category = "laptop", Subtype = "ultrabook",
            Price = 1099, PriceLabel = "From $1,099", Os = "macOS", ReleaseYear = 2026,
            Cpu = "Apple M5", CpuCores = "10-core (4P+6E)",
            Gpu = "Apple M5 10-core GPU", GpuVram = "Shared",
            Ram = "16 GB (up to 32 GB)", RamType = "LPDDR5X",
            Storage = "256 GB – 2 TB SSD",
            Display = "13.6\" Liquid Retina", Resolution = "2560 × 1664",
            RefreshRate = "60 Hz", PanelType = "IPS",
            Battery = "18 hours", Weight = "1.24 kg",
            Ports = "2× Thunderbolt 4, MagSafe 3, 3.5mm", Webcam = "12 MP Center Stage",
            PerformanceScore = 74, EfficiencyScore = 96, ValueScore = 88, BatteryScore = 92,
            Gradient = "from-sky-400/25 to-blue-600/35", Icon = "💻", Badge = "Best Seller",
        },
        new()
        {
            Id = "mba15-m5", Name = "MacBook Air 15\" M5",
            Brand = "Apple", Category = "laptop", Subtype = "ultrabook",
            Price = 1299, PriceLabel = "From $1,299", Os = "macOS", ReleaseYear = 2026,
            Cpu = "Apple M5", CpuCores = "10-core (4P+6E)",
            Gpu = "Apple M5 10-core GPU", GpuVram = "Shared",
            Ram = "16 GB (up to 32 GB)", RamType = "LPDDR5X",
            Storage = "256 GB – 2 TB SSD",
            Display = "15.3\" Liquid Retina", Resolution = "2880 × 1864",
            RefreshRate = "60 Hz", PanelType = "IPS",
            Battery = "18 hours", Weight = "1.51 kg",
            Ports = "2× Thunderbolt 4, MagSafe 3, 3.5mm", Webcam = "12 MP Center Stage",
            PerformanceScore = 74, EfficiencyScore = 95, ValueScore = 82, BatteryScore = 91,
            Gradient = "from-slate-400/25 to-sky-600/35", Icon = "💻",
        },
        new()
        {
            Id = "mbp14-m5pro", Name = "MacBook Pro 14\" M5 Pro",
            Brand = "Apple", Category = "laptop", Subtype = "professional",
            Price = 1999, PriceLabel = "From $1,999", Os = "macOS", ReleaseYear = 2026,
            Cpu = "Apple M5 Pro", CpuCores = "14-core (10P+4E)",
            Gpu = "Apple M5 Pro 20-core GPU", GpuVram = "Shared",
            Ram = "24 GB (up to 64 GB)", RamType = "LPDDR5X",
            Storage = "512 GB – 8 TB SSD",
            Display = "14.2\" Liquid Retina XDR", Resolution = "3024 × 1964",
            RefreshRate = "120 Hz ProMotion", PanelType = "Mini-LED",
            Battery = "22 hours", Weight = "1.61 kg",
            Ports = "3× Thunderbolt 5, HDMI 2.1, SD, MagSafe 3", Webcam = "12 MP Center Stage",
            PerformanceScore = 88, EfficiencyScore = 94, ValueScore = 78, BatteryScore = 95,
            Gradient = "from-gray-400/25 to-slate-600/35", Icon = "💻", Badge = "Editor's Pick",
        },
        new()
        {
            Id = "mbp16-m5max", Name = "MacBook Pro 16\" M5 Max",
            Brand = "Apple", Category = "laptop", Subtype = "professional",
            Price = 3499, PriceLabel = "From $3,499", Os = "macOS", ReleaseYear = 2026,
            Cpu = "Apple M5 Max", CpuCores = "16-core (12P+4E)",
            Gpu = "Apple M5 Max 40-core GPU", GpuVram = "Shared",
            Ram = "48 GB (up to 128 GB)", RamType = "LPDDR5X",
            Storage = "512 GB – 8 TB SSD",
            Display = "16.2\" Liquid Retina XDR", Resolution = "3456 × 2234",
            RefreshRate = "120 Hz ProMotion", PanelType = "Mini-LED",
            Battery = "24 hours", Weight = "2.14 kg",
            Ports = "3× Thunderbolt 5, HDMI 2.1, SD, MagSafe 3", Webcam = "12 MP Center Stage",
            PerformanceScore = 97, EfficiencyScore = 92, ValueScore = 64, BatteryScore = 97,
            Gradient = "from-neutral-400/25 to-gray-600/35", Icon = "💻",
        },
        new()
        {
            Id = "dell-xps14", Name = "Dell XPS 14 (2026)",
            Brand = "Dell", Category = "laptop", Subtype = "creator",
            Price = 1899, PriceLabel = "From $1,899", Os = "Windows", ReleaseYear = 2026,
            Cpu = "Intel Core Ultra 9 295H", CpuCores = "24-core (8P+16E)",
            Gpu = "NVIDIA GeForce RTX 4070 Laptop", GpuVram = "8 GB GDDR6",
            Ram = "32 GB (up to 64 GB)", RamType = "LPDDR5X",
            Storage = "1 TB – 4 TB SSD",
            Display = "14.5\" 2.8K OLED", Resolution = "2880 × 1800",
            RefreshRate = "120 Hz", PanelType = "OLED",
            Battery = "12 hours", Weight = "1.67 kg",
            Ports = "2× Thunderbolt 4, USB-A, SD, 3.5mm", Webcam = "2 MP IR",
            PerformanceScore = 82, EfficiencyScore = 70, ValueScore = 73, BatteryScore = 65,
            Gradient = "from-blue-400/25 to-cyan-600/35", Icon = "🖥", Badge = "New",
        },
        new()
        {
            Id = "asus-rog-g14", Name = "ASUS ROG Zephyrus G14",
            Brand = "ASUS", Category = "laptop", Subtype = "gaming",
            Price = 2499, PriceLabel = "From $2,499", Os = "Windows", ReleaseYear = 2026,
            Cpu = "AMD Ryzen AI 9 HX 370", CpuCores = "12-core (4P+8E)",
            Gpu = "NVIDIA RTX 5080 Laptop", GpuVram = "12 GB GDDR7",
            Ram = "32 GB", RamType = "LPDDR5X",
            Storage = "1 TB SSD",
            Display = "14\" QHD+ OLED", Resolution = "2560 × 1600",
            RefreshRate = "165 Hz", PanelType = "OLED",
            Battery = "10 hours", Weight = "1.65 kg",
            Ports = "2× USB-C (DP+PD), 2× USB-A, HDMI 2.1, 3.5mm", Webcam = "1080p",
            PerformanceScore = 90, EfficiencyScore = 72, ValueScore = 76, BatteryScore = 54,
            Gradient = "from-red-400/25 to-rose-700/35", Icon = "🎮", Badge = "Top Gaming",
        },
        new()
        {
            Id = "lenovo-x1c-g13", Name = "ThinkPad X1 Carbon Gen 13",
            Brand = "Lenovo", Category = "laptop", Subtype = "ultrabook",
            Price = 1749, PriceLabel = "From $1,749", Os = "Windows", ReleaseYear = 2026,
            Cpu = "Intel Core Ultra 7 266V", CpuCores = "8-core (4P+4LPE)",
            Gpu = "Intel Arc 140V", GpuVram = "8 GB shared",
            Ram = "32 GB", RamType = "LPDDR5X",
            Storage = "512 GB – 2 TB SSD",
            Display = "14\" 2.8K IPS", Resolution = "2880 × 1800",
            RefreshRate = "120 Hz", PanelType = "IPS",
            Battery = "15 hours", Weight = "1.12 kg",
            Ports = "2× Thunderbolt 4, 2× USB-A, HDMI 2.1, SD", Webcam = "1080p IR",
            PerformanceScore = 68, EfficiencyScore = 80, ValueScore = 70, BatteryScore = 78,
            Gradient = "from-zinc-400/25 to-red-700/35", Icon = "💼",
        },
        new()
        {
            Id = "razer-blade16", Name = "Razer Blade 16 (2026)",
            Brand = "Razer", Category = "laptop", Subtype = "gaming",
            Price = 4499, PriceLabel = "From $4,499", Os = "Windows", ReleaseYear = 2026,
            Cpu = "Intel Core Ultra 9 285HX", CpuCores = "24-core (8P+16E)",
            Gpu = "NVIDIA RTX 5090 Laptop", GpuVram = "16 GB GDDR7",
            Ram = "32 GB DDR5", RamType = "DDR5-5600",
            Storage = "2 TB NVMe SSD",
            Display = "16\" QHD+ Mini-LED", Resolution = "2560 × 1600",
            RefreshRate = "240 Hz", PanelType = "Mini-LED",
            Battery = "8 hours", Weight = "2.14 kg",
            Ports = "3× USB-C (TB5+DP), 2× USB-A, HDMI 2.1, SD", Webcam = "1080p IR",
            PerformanceScore = 98, EfficiencyScore = 60, ValueScore = 55, BatteryScore = 42,
            Gradient = "from-green-400/20 to-emerald-800/35", Icon = "🎮",
        },
        new()
        {
            Id = "surface-laptop7", Name = "Surface Laptop 7 (15\")",
            Brand = "Microsoft", Category = "laptop", Subtype = "ultrabook",
            Price = 1499, PriceLabel = "From $1,499", Os = "Windows", ReleaseYear = 2026,
            Cpu = "Snapdragon X Elite X1E-84-100", CpuCores = "12-core",
            Gpu = "Qualcomm Adreno X1-85", GpuVram = "Shared",
            Ram = "16 GB (up to 64 GB)", RamType = "LPDDR5X",
            Storage = "512 GB – 1 TB SSD",
            Display = "15\" PixelSense IPS", Resolution = "2496 × 1664",
            RefreshRate = "120 Hz", PanelType = "IPS",
            Battery = "22 hours", Weight = "1.66 kg",
            Ports = "2× USB-C (USB 4), USB-A, Surface Connect, 3.5mm", Webcam = "1080p HDR",
            PerformanceScore = 72, EfficiencyScore = 88, ValueScore = 80, BatteryScore = 90,
            Gradient = "from-blue-400/25 to-indigo-700/35", Icon = "🪟", Badge = "Great Battery",
        },

        // ── DESKTOPS ─────────────────────────────────────────────────────────
        new()
        {
            Id = "mac-mini-m5", Name = "Mac mini M5",
            Brand = "Apple", Category = "desktop", Subtype = "mini",
            Price = 699, PriceLabel = "From $699", Os = "macOS", ReleaseYear = 2026,
            Cpu = "Apple M5", CpuCores = "10-core (4P+6E)",
            Gpu = "Apple M5 10-core GPU", GpuVram = "Shared",
            Ram = "16 GB (up to 32 GB)", RamType = "LPDDR5X",
            Storage = "256 GB – 2 TB SSD",
            Ports = "3× Thunderbolt 4, 2× USB-A, HDMI 2.1, 2.5GbE",
            PerformanceScore = 74, EfficiencyScore = 96, ValueScore = 92,
            Gradient = "from-gray-400/20 to-slate-600/30", Icon = "🖥", Badge = "Best Value",
        },
        new()
        {
            Id = "mac-studio-m5max", Name = "Mac Studio M5 Max",
            Brand = "Apple", Category = "desktop", Subtype = "workstation",
            Price = 1999, PriceLabel = "From $1,999", Os = "macOS", ReleaseYear = 2026,
            Cpu = "Apple M5 Max", CpuCores = "16-core (12P+4E)",
            Gpu = "Apple M5 Max 40-core GPU", GpuVram = "Shared",
            Ram = "96 GB (up to 192 GB)", RamType = "LPDDR5X",
            Storage = "512 GB – 8 TB SSD",
            Ports = "6× Thunderbolt 5, 2× USB-A, HDMI 2.1, 10GbE, SD",
            PerformanceScore = 96, EfficiencyScore = 93, ValueScore = 80,
            Gradient = "from-neutral-400/20 to-gray-700/30", Icon = "🖥", Badge = "Pro Pick",
        },
        new()
        {
            Id = "imac24-m5", Name = "iMac 24\" M5",
            Brand = "Apple", Category = "desktop", Subtype = "all-in-one",
            Price = 1299, PriceLabel = "From $1,299", Os = "macOS", ReleaseYear = 2026,
            Cpu = "Apple M5", CpuCores = "10-core (4P+6E)",
            Gpu = "Apple M5 10-core GPU", GpuVram = "Shared",
            Ram = "16 GB (up to 32 GB)", RamType = "LPDDR5X",
            Storage = "256 GB – 2 TB SSD",
            Display = "24\" 4.5K Retina", Resolution = "4480 × 2520",
            RefreshRate = "60 Hz", PanelType = "IPS",
            Ports = "2× Thunderbolt 4, 2× USB-3, Ethernet, MagSafe",
            PerformanceScore = 74, EfficiencyScore = 94, ValueScore = 82,
            Gradient = "from-pink-400/20 to-purple-600/30", Icon = "🖥",
        },
        new()
        {
            Id = "custom-ryzen-gaming", Name = "Custom Ryzen 9 Gaming Tower",
            Brand = "Custom", Category = "desktop", Subtype = "custom",
            Price = 2200, PriceLabel = "~$2,200 (DIY)", Os = "Windows", ReleaseYear = 2026,
            Cpu = "AMD Ryzen 9 9950X", CpuCores = "16-core/32-thread",
            Gpu = "NVIDIA RTX 5070 Ti", GpuVram = "16 GB GDDR7",
            Ram = "32 GB DDR5-6000", RamType = "DDR5",
            Storage = "2 TB NVMe Gen5 SSD",
            Ports = "Full ATX: USB4, USB-A 3.2, USB-C, PCIe 5.0",
            PerformanceScore = 89, EfficiencyScore = 68, ValueScore = 86,
            Gradient = "from-red-400/20 to-orange-600/30", Icon = "🖥", Badge = "DIY Pick",
        },
        new()
        {
            Id = "custom-intel-workstation", Name = "Intel Core i9 Workstation",
            Brand = "Custom", Category = "desktop", Subtype = "workstation",
            Price = 4500, PriceLabel = "~$4,500 (configured)", Os = "Windows", ReleaseYear = 2026,
            Cpu = "Intel Core i9-14900K", CpuCores = "24-core/32-thread",
            Gpu = "NVIDIA RTX 5090", GpuVram = "24 GB GDDR7",
            Ram = "64 GB DDR5-6400", RamType = "DDR5",
            Storage = "4 TB NVMe SSD (RAID-ready)",
            Ports = "Full ATX: Thunderbolt 5, USB4, PCIe 5.0 ×16",
            PerformanceScore = 100, EfficiencyScore = 52, ValueScore = 60,
            Gradient = "from-blue-400/20 to-indigo-800/30", Icon = "🖥",
        },

        // ── COMPONENTS ───────────────────────────────────────────────────────
        new()
        {
            Id = "cpu-m5-pro", Name = "Apple M5 Pro",
            Brand = "Apple", Category = "component", Subtype = "cpu",
            Price = 0, PriceLabel = "In MacBook Pro / Mac Studio", Os = "N/A", ReleaseYear = 2026,
            Cpu = "Apple M5 Pro", CpuCores = "14-core (10P+4E)",
            Gpu = "20-core GPU", GpuVram = "Unified memory",
            Ram = "24–64 GB Unified", Storage = "N/A",
            PerformanceScore = 88, EfficiencyScore = 95, ValueScore = 80,
            Gradient = "from-gray-400/20 to-slate-600/30", Icon = "🧠", Badge = "Silicon",
        },
        new()
        {
            Id = "cpu-m5-max", Name = "Apple M5 Max",
            Brand = "Apple", Category = "component", Subtype = "cpu",
            Price = 0, PriceLabel = "In MacBook Pro 16\" / Mac Studio", Os = "N/A", ReleaseYear = 2026,
            Cpu = "Apple M5 Max", CpuCores = "16-core (12P+4E)",
            Gpu = "40-core GPU", GpuVram = "Unified memory",
            Ram = "48–128 GB Unified", Storage = "N/A",
            PerformanceScore = 97, EfficiencyScore = 93, ValueScore = 72,
            Gradient = "from-neutral-500/20 to-gray-700/30", Icon = "🧠",
        },
        new()
        {
            Id = "cpu-intel-cu9-295h", Name = "Intel Core Ultra 9 295H",
            Brand = "Intel", Category = "component", Subtype = "cpu",
            Price = 650, PriceLabel = "~$650", Os = "N/A", ReleaseYear = 2024,
            Cpu = "Intel Core Ultra 9 295H", CpuCores = "24-core (8P+16E)",
            Gpu = "Intel Arc 8-core", GpuVram = "Shared",
            Ram = "Up to 96 GB LPDDR5X", Storage = "N/A",
            PerformanceScore = 82, EfficiencyScore = 68, ValueScore = 65,
            Gradient = "from-blue-400/20 to-cyan-600/30", Icon = "🧠", Badge = "Lunar Lake",
        },
        new()
        {
            Id = "cpu-amd-ryzen-ai9-hx370", Name = "AMD Ryzen AI 9 HX 370",
            Brand = "AMD", Category = "component", Subtype = "cpu",
            Price = 500, PriceLabel = "~$500", Os = "N/A", ReleaseYear = 2024,
            Cpu = "AMD Ryzen AI 9 HX 370", CpuCores = "12-core (4P+8E) Strix Point",
            Gpu = "AMD Radeon 890M", GpuVram = "Shared",
            Ram = "Up to 64 GB LPDDR5X", Storage = "N/A",
            PerformanceScore = 84, EfficiencyScore = 74, ValueScore = 76,
            Gradient = "from-red-400/20 to-orange-600/30", Icon = "🧠", Badge = "Strix Point",
        },
        new()
        {
            Id = "gpu-rtx5090", Name = "NVIDIA GeForce RTX 5090",
            Brand = "NVIDIA", Category = "component", Subtype = "gpu",
            Price = 1999, PriceLabel = "From $1,999", Os = "N/A", ReleaseYear = 2025,
            Cpu = "N/A", Gpu = "NVIDIA RTX 5090", GpuVram = "24 GB GDDR7",
            Ram = "N/A", Storage = "N/A",
            PerformanceScore = 100, EfficiencyScore = 62, ValueScore = 50,
            Gradient = "from-green-400/20 to-emerald-700/30", Icon = "🎮", Badge = "Flagship",
        },
        new()
        {
            Id = "gpu-rtx5080", Name = "NVIDIA GeForce RTX 5080",
            Brand = "NVIDIA", Category = "component", Subtype = "gpu",
            Price = 999, PriceLabel = "From $999", Os = "N/A", ReleaseYear = 2025,
            Cpu = "N/A", Gpu = "NVIDIA RTX 5080", GpuVram = "16 GB GDDR7",
            Ram = "N/A", Storage = "N/A",
            PerformanceScore = 88, EfficiencyScore = 72, ValueScore = 74,
            Gradient = "from-green-400/20 to-teal-700/30", Icon = "🎮",
        },
        new()
        {
            Id = "gpu-rx9070xt", Name = "AMD Radeon RX 9070 XT",
            Brand = "AMD", Category = "component", Subtype = "gpu",
            Price = 599, PriceLabel = "From $599", Os = "N/A", ReleaseYear = 2025,
            Cpu = "N/A", Gpu = "AMD RX 9070 XT", GpuVram = "16 GB GDDR6",
            Ram = "N/A", Storage = "N/A",
            PerformanceScore = 80, EfficiencyScore = 82, ValueScore = 88,
            Gradient = "from-red-400/20 to-orange-700/30", Icon = "🎮", Badge = "Best Value GPU",
        },
    ];

    public static readonly List<Guide> Guides =
    [
        new()
        {
            Id = "g1", Title = "Best Laptop for Programming in 2026",
            Excerpt = "From Apple silicon to Snapdragon X Elite, we break down the top picks for software developers who demand speed, battery, and great displays.",
            Category = "Buying Guide", ReadTime = "8 min",
            Gradient = "from-blue-400/25 to-indigo-600/35", Icon = "👨‍💻", PublishDate = "Mar 5, 2026",
            Highlights = ["M5 Pro crushes compile times", "ThinkPad X1 for Linux lovers", "Surface Laptop 7 for .NET developers"],
        },
        new()
        {
            Id = "g2", Title = "GPU Buying Guide 2026: RTX 5000 vs AMD RX 9000",
            Excerpt = "NVIDIA raised the bar with RTX 5090, but AMD fights back with value. This guide helps you choose the right GPU for gaming, AI, or creative work.",
            Category = "GPU Guide", ReadTime = "10 min",
            Gradient = "from-green-400/25 to-emerald-700/35", Icon = "🎮", PublishDate = "Feb 20, 2026",
            Highlights = ["RTX 5090 is unmatched for 4K gaming", "RX 9070 XT is the value king", "RTX 5080 hits the sweet spot"],
        },
        new()
        {
            Id = "g3", Title = "Mac vs PC in 2026: A Fair Comparison",
            Excerpt = "We test and compare Apple silicon Macs against the best Windows laptops across performance, battery life, software, and total cost of ownership.",
            Category = "Comparison", ReadTime = "12 min",
            Gradient = "from-purple-400/25 to-pink-600/35", Icon = "⚖", PublishDate = "Jan 30, 2026",
            Highlights = ["M5 Max beats everything in efficiency", "Windows wins for gaming", "macOS still leads for creative pros"],
        },
        new()
        {
            Id = "g4", Title = "How to Read Laptop Specs (2026 Edition)",
            Excerpt = "TDP, LPDDR5X, ProMotion, unified memory — we demystify the jargon so you can make an informed decision without a computer science degree.",
            Category = "Beginner", ReadTime = "6 min",
            Gradient = "from-amber-400/25 to-orange-600/35", Icon = "📖", PublishDate = "Jan 10, 2026",
            Highlights = ["What \"efficiency cores\" actually mean", "Unified vs dedicated VRAM", "Why refresh rate matters for you"],
        },
        new()
        {
            Id = "g5", Title = "Best Budget Gaming Laptops 2026 (Under $2,000)",
            Excerpt = "You don't need to spend $4,500 for great gaming. The ASUS ROG Zephyrus G14 and others deliver RTX 5080 performance at sane prices.",
            Category = "Budget Guide", ReadTime = "7 min",
            Gradient = "from-red-400/25 to-rose-700/35", Icon = "💰", PublishDate = "Dec 15, 2025",
            Highlights = ["G14 is the pick at $2,499", "OLED panels at this price are wild", "Battery life trade-offs to know"],
        },
    ];

    public static readonly List<Faq> Faqs =
    [
        new() { Id = "f1", Category = "Comparing", Question = "How are performance scores calculated?", Answer = "Our scores are normalized across Geekbench 6 multi-core, Cinebench 2024, and real-world workload benchmarks. A score of 100 represents the highest-performing model in our database for that category. Scores are updated quarterly." },
        new() { Id = "f2", Category = "Comparing", Question = "Can I compare laptops with desktops?", Answer = "Yes — the Compare Tool supports mixing categories. However, scores like battery and portability are only shown for laptops. Component comparisons (CPU vs CPU) focus on compute-specific metrics." },
        new() { Id = "f3", Category = "Comparing", Question = "Why are Apple M5 efficiency scores so high?", Answer = "Apple M5 chips use a monolithic die with unified memory, eliminating the CPU-to-GPU data bus bottleneck. Combined with TSMC 3nm fabrication, they deliver exceptional performance-per-watt versus competing Intel and AMD laptop chips." },
        new() { Id = "f4", Category = "Pricing", Question = "Are prices accurate and up to date?", Answer = "Prices shown are manufacturer suggested retail prices (MSRP) at launch in USD. They may not reflect current retail pricing, regional taxes, or promotions. Always verify on the manufacturer's website before purchasing." },
        new() { Id = "f5", Category = "Pricing", Question = "Should I wait for the next generation?", Answer = "Generally, if a product was released in the last 6 months it represents current-gen value. Apple refreshes annually (M-series), while Intel and AMD tend to refresh every 12–18 months for laptop and desktop CPUs." },
        new() { Id = "f6", Category = "Technical", Question = "What is unified memory vs dedicated VRAM?", Answer = "Unified memory (Apple M-series) is shared between CPU and GPU at very high bandwidth (up to 800 GB/s on M5 Max). Dedicated VRAM (NVIDIA, AMD GPUs) is physically separate and only accessible by the GPU. Both approaches have trade-offs in GPU-intensive tasks." },
        new() { Id = "f7", Category = "Technical", Question = "What does TDP mean for laptops?", Answer = "Thermal Design Power (TDP) is the maximum power a processor is designed to consume under sustained load. Lower TDP means cooler, quieter operation but may limit peak performance. Laptops typically run chips at reduced TDP (15–45W) vs desktop variants (65–125W+)." },
        new() { Id = "f8", Category = "Technical", Question = "Is OLED better than Mini-LED for laptops?", Answer = "OLED offers perfect blacks, infinite contrast, and faster response times — ideal for media and color work. Mini-LED (like Apple's Liquid Retina XDR) is brighter, has no risk of burn-in, and better for sustained work in bright environments. Both are premium options." },
        new() { Id = "f9", Category = "Platform", Question = "Which is better for software development: Mac or PC?", Answer = "Both are excellent. Macs run native Unix (macOS/Darwin), which aligns well with Linux servers, and Apple silicon performance is outstanding. Windows offers WSL2 (Windows Subsystem for Linux) for a similar Unix experience plus wider hardware choice. Many developers prefer Mac for the terminal experience." },
        new() { Id = "f10", Category = "Platform", Question = "Can Macs run Windows or gaming?", Answer = "Yes, via Parallels virtualization (not native Boot Camp since M-series). Gaming on Mac is improving with Metal API and Apple's game porting toolkit, but the Windows/DirectX gaming library is vastly larger. Dedicated gaming laptops (ASUS ROG, Razer) remain superior for gaming." },
    ];
}
