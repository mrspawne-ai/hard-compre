import type { ComputerModel, Guide, FaqItem } from '../types';

// ════════════════════════════════════════════════════════════════════════════
//  HardCompare — Hardware database (2026 era models)
//  Scores: performanceScore (raw compute), efficiencyScore (perf/watt),
//          valueScore (perf/dollar), batteryScore (runtime, laptop only)
// ════════════════════════════════════════════════════════════════════════════

export const ALL_MODELS: ComputerModel[] = [

  // ── LAPTOPS ──────────────────────────────────────────────────────────────

  {
    id: 'mba13-m5',
    name: 'MacBook Air 13" M5',
    brand: 'Apple', category: 'laptop', subtype: 'ultrabook',
    price: 1099, priceLabel: 'From $1,099', os: 'macOS', releaseYear: 2026,
    cpu: 'Apple M5', cpuCores: '10-core (4P+6E)',
    gpu: 'Apple M5 10-core GPU', gpuVram: 'Shared',
    ram: '16 GB (up to 32 GB)', ramType: 'LPDDR5X',
    storage: '256 GB – 2 TB SSD',
    display: '13.6" Liquid Retina', resolution: '2560 × 1664', refreshRate: '60 Hz', panelType: 'IPS',
    battery: '18 hours', weight: '1.24 kg',
    ports: '2× Thunderbolt 4, MagSafe 3, 3.5mm', webcam: '12 MP Center Stage',
    performanceScore: 74, efficiencyScore: 96, valueScore: 88, batteryScore: 92,
    gradient: 'from-sky-400/25 to-blue-600/35', icon: '💻', badge: 'Best Seller',
  },

  {
    id: 'mba15-m5',
    name: 'MacBook Air 15" M5',
    brand: 'Apple', category: 'laptop', subtype: 'ultrabook',
    price: 1299, priceLabel: 'From $1,299', os: 'macOS', releaseYear: 2026,
    cpu: 'Apple M5', cpuCores: '10-core (4P+6E)',
    gpu: 'Apple M5 10-core GPU', gpuVram: 'Shared',
    ram: '16 GB (up to 32 GB)', ramType: 'LPDDR5X',
    storage: '256 GB – 2 TB SSD',
    display: '15.3" Liquid Retina', resolution: '2880 × 1864', refreshRate: '60 Hz', panelType: 'IPS',
    battery: '18 hours', weight: '1.51 kg',
    ports: '2× Thunderbolt 4, MagSafe 3, 3.5mm', webcam: '12 MP Center Stage',
    performanceScore: 74, efficiencyScore: 95, valueScore: 82, batteryScore: 91,
    gradient: 'from-slate-400/25 to-sky-600/35', icon: '💻',
  },

  {
    id: 'mbp14-m5pro',
    name: 'MacBook Pro 14" M5 Pro',
    brand: 'Apple', category: 'laptop', subtype: 'professional',
    price: 1999, priceLabel: 'From $1,999', os: 'macOS', releaseYear: 2026,
    cpu: 'Apple M5 Pro', cpuCores: '14-core (10P+4E)',
    gpu: 'Apple M5 Pro 20-core GPU', gpuVram: 'Shared',
    ram: '24 GB (up to 64 GB)', ramType: 'LPDDR5X',
    storage: '512 GB – 8 TB SSD',
    display: '14.2" Liquid Retina XDR', resolution: '3024 × 1964', refreshRate: '120 Hz ProMotion', panelType: 'Mini-LED',
    battery: '22 hours', weight: '1.61 kg',
    ports: '3× Thunderbolt 5, HDMI 2.1, SD, MagSafe 3', webcam: '12 MP Center Stage',
    performanceScore: 88, efficiencyScore: 94, valueScore: 78, batteryScore: 95,
    gradient: 'from-gray-400/25 to-slate-600/35', icon: '💻', badge: 'Editor\'s Pick',
  },

  {
    id: 'mbp16-m5max',
    name: 'MacBook Pro 16" M5 Max',
    brand: 'Apple', category: 'laptop', subtype: 'professional',
    price: 3499, priceLabel: 'From $3,499', os: 'macOS', releaseYear: 2026,
    cpu: 'Apple M5 Max', cpuCores: '16-core (12P+4E)',
    gpu: 'Apple M5 Max 40-core GPU', gpuVram: 'Shared',
    ram: '48 GB (up to 128 GB)', ramType: 'LPDDR5X',
    storage: '512 GB – 8 TB SSD',
    display: '16.2" Liquid Retina XDR', resolution: '3456 × 2234', refreshRate: '120 Hz ProMotion', panelType: 'Mini-LED',
    battery: '24 hours', weight: '2.14 kg',
    ports: '3× Thunderbolt 5, HDMI 2.1, SD, MagSafe 3', webcam: '12 MP Center Stage',
    performanceScore: 97, efficiencyScore: 92, valueScore: 64, batteryScore: 97,
    gradient: 'from-neutral-400/25 to-gray-600/35', icon: '💻',
  },

  {
    id: 'dell-xps14',
    name: 'Dell XPS 14 (2026)',
    brand: 'Dell', category: 'laptop', subtype: 'creator',
    price: 1899, priceLabel: 'From $1,899', os: 'Windows', releaseYear: 2026,
    cpu: 'Intel Core Ultra 9 295H', cpuCores: '24-core (8P+16E)',
    gpu: 'NVIDIA GeForce RTX 4070 Laptop', gpuVram: '8 GB GDDR6',
    ram: '32 GB (up to 64 GB)', ramType: 'LPDDR5X',
    storage: '1 TB – 4 TB SSD',
    display: '14.5" 2.8K OLED', resolution: '2880 × 1800', refreshRate: '120 Hz', panelType: 'OLED',
    battery: '12 hours', weight: '1.67 kg',
    ports: '2× Thunderbolt 4, USB-A, SD, 3.5mm', webcam: '2 MP IR',
    performanceScore: 82, efficiencyScore: 70, valueScore: 73, batteryScore: 65,
    gradient: 'from-blue-400/25 to-cyan-600/35', icon: '🖥', badge: 'New',
  },

  {
    id: 'asus-rog-g14',
    name: 'ASUS ROG Zephyrus G14',
    brand: 'ASUS', category: 'laptop', subtype: 'gaming',
    price: 2499, priceLabel: 'From $2,499', os: 'Windows', releaseYear: 2026,
    cpu: 'AMD Ryzen AI 9 HX 370', cpuCores: '12-core (4P+8E)',
    gpu: 'NVIDIA RTX 5080 Laptop', gpuVram: '12 GB GDDR7',
    ram: '32 GB', ramType: 'LPDDR5X',
    storage: '1 TB SSD',
    display: '14" QHD+ OLED', resolution: '2560 × 1600', refreshRate: '165 Hz', panelType: 'OLED',
    battery: '10 hours', weight: '1.65 kg',
    ports: '2× USB-C (DP+PD), 2× USB-A, HDMI 2.1, 3.5mm', webcam: '1080p',
    performanceScore: 90, efficiencyScore: 72, valueScore: 76, batteryScore: 54,
    gradient: 'from-red-400/25 to-rose-700/35', icon: '🎮', badge: 'Top Gaming',
  },

  {
    id: 'lenovo-x1c-g13',
    name: 'ThinkPad X1 Carbon Gen 13',
    brand: 'Lenovo', category: 'laptop', subtype: 'ultrabook',
    price: 1749, priceLabel: 'From $1,749', os: 'Windows', releaseYear: 2026,
    cpu: 'Intel Core Ultra 7 266V', cpuCores: '8-core (4P+4LPE)',
    gpu: 'Intel Arc 140V', gpuVram: '8 GB shared',
    ram: '32 GB', ramType: 'LPDDR5X',
    storage: '512 GB – 2 TB SSD',
    display: '14" 2.8K IPS', resolution: '2880 × 1800', refreshRate: '120 Hz', panelType: 'IPS',
    battery: '15 hours', weight: '1.12 kg',
    ports: '2× Thunderbolt 4, 2× USB-A, HDMI 2.1, SD', webcam: '1080p IR',
    performanceScore: 68, efficiencyScore: 80, valueScore: 70, batteryScore: 78,
    gradient: 'from-zinc-400/25 to-red-700/35', icon: '💼',
  },

  {
    id: 'razer-blade16',
    name: 'Razer Blade 16 (2026)',
    brand: 'Razer', category: 'laptop', subtype: 'gaming',
    price: 4499, priceLabel: 'From $4,499', os: 'Windows', releaseYear: 2026,
    cpu: 'Intel Core Ultra 9 285HX', cpuCores: '24-core (8P+16E)',
    gpu: 'NVIDIA RTX 5090 Laptop', gpuVram: '16 GB GDDR7',
    ram: '32 GB DDR5', ramType: 'DDR5-5600',
    storage: '2 TB NVMe SSD',
    display: '16" QHD+ Mini-LED', resolution: '2560 × 1600', refreshRate: '240 Hz', panelType: 'Mini-LED',
    battery: '8 hours', weight: '2.14 kg',
    ports: '3× USB-C (TB5+DP), 2× USB-A, HDMI 2.1, SD', webcam: '1080p IR',
    performanceScore: 98, efficiencyScore: 60, valueScore: 55, batteryScore: 42,
    gradient: 'from-green-400/20 to-emerald-800/35', icon: '🎮',
  },

  {
    id: 'surface-laptop7',
    name: 'Surface Laptop 7 (15")',
    brand: 'Microsoft', category: 'laptop', subtype: 'ultrabook',
    price: 1499, priceLabel: 'From $1,499', os: 'Windows', releaseYear: 2026,
    cpu: 'Snapdragon X Elite X1E-84-100', cpuCores: '12-core',
    gpu: 'Qualcomm Adreno X1-85', gpuVram: 'Shared',
    ram: '16 GB (up to 64 GB)', ramType: 'LPDDR5X',
    storage: '512 GB – 1 TB SSD',
    display: '15" PixelSense IPS', resolution: '2496 × 1664', refreshRate: '120 Hz', panelType: 'IPS',
    battery: '22 hours', weight: '1.66 kg',
    ports: '2× USB-C (USB 4), USB-A, Surface Connect, 3.5mm', webcam: '1080p HDR',
    performanceScore: 72, efficiencyScore: 88, valueScore: 80, batteryScore: 90,
    gradient: 'from-blue-400/25 to-indigo-700/35', icon: '🪟', badge: 'Great Battery',
  },

  // ── DESKTOPS ─────────────────────────────────────────────────────────────

  {
    id: 'mac-mini-m5',
    name: 'Mac mini M5',
    brand: 'Apple', category: 'desktop', subtype: 'mini',
    price: 699, priceLabel: 'From $699', os: 'macOS', releaseYear: 2026,
    cpu: 'Apple M5', cpuCores: '10-core (4P+6E)',
    gpu: 'Apple M5 10-core GPU', gpuVram: 'Shared',
    ram: '16 GB (up to 32 GB)', ramType: 'LPDDR5X',
    storage: '256 GB – 2 TB SSD',
    ports: '3× Thunderbolt 4, 2× USB-A, HDMI 2.1, 2.5GbE',
    performanceScore: 74, efficiencyScore: 96, valueScore: 92, batteryScore: undefined,
    gradient: 'from-gray-400/20 to-slate-600/30', icon: '🖥', badge: 'Best Value',
  },

  {
    id: 'mac-studio-m5max',
    name: 'Mac Studio M5 Max',
    brand: 'Apple', category: 'desktop', subtype: 'workstation',
    price: 1999, priceLabel: 'From $1,999', os: 'macOS', releaseYear: 2026,
    cpu: 'Apple M5 Max', cpuCores: '16-core (12P+4E)',
    gpu: 'Apple M5 Max 40-core GPU', gpuVram: 'Shared',
    ram: '96 GB (up to 192 GB)', ramType: 'LPDDR5X',
    storage: '512 GB – 8 TB SSD',
    ports: '6× Thunderbolt 5, 2× USB-A, HDMI 2.1, 10GbE, SD',
    performanceScore: 96, efficiencyScore: 93, valueScore: 80, batteryScore: undefined,
    gradient: 'from-neutral-400/20 to-gray-700/30', icon: '🖥', badge: 'Pro Pick',
  },

  {
    id: 'imac24-m5',
    name: 'iMac 24" M5',
    brand: 'Apple', category: 'desktop', subtype: 'all-in-one',
    price: 1299, priceLabel: 'From $1,299', os: 'macOS', releaseYear: 2026,
    cpu: 'Apple M5', cpuCores: '10-core (4P+6E)',
    gpu: 'Apple M5 10-core GPU', gpuVram: 'Shared',
    ram: '16 GB (up to 32 GB)', ramType: 'LPDDR5X',
    storage: '256 GB – 2 TB SSD',
    display: '24" 4.5K Retina', resolution: '4480 × 2520', refreshRate: '60 Hz', panelType: 'IPS',
    ports: '2× Thunderbolt 4, 2× USB-3, Ethernet, MagSafe',
    performanceScore: 74, efficiencyScore: 94, valueScore: 82, batteryScore: undefined,
    gradient: 'from-pink-400/20 to-purple-600/30', icon: '🖥',
  },

  {
    id: 'custom-ryzen-gaming',
    name: 'Custom Ryzen 9 Gaming Tower',
    brand: 'Custom', category: 'desktop', subtype: 'custom',
    price: 2200, priceLabel: '~$2,200 (DIY)', os: 'Windows', releaseYear: 2026,
    cpu: 'AMD Ryzen 9 9950X', cpuCores: '16-core/32-thread',
    gpu: 'NVIDIA RTX 5070 Ti', gpuVram: '16 GB GDDR7',
    ram: '32 GB DDR5-6000', ramType: 'DDR5',
    storage: '2 TB NVMe Gen5 SSD',
    ports: 'Full ATX: USB4, USB-A 3.2, USB-C, PCIe 5.0',
    performanceScore: 89, efficiencyScore: 68, valueScore: 86, batteryScore: undefined,
    gradient: 'from-red-400/20 to-orange-600/30', icon: '🖥', badge: 'DIY Pick',
  },

  {
    id: 'custom-intel-workstation',
    name: 'Intel Core i9 Workstation',
    brand: 'Custom', category: 'desktop', subtype: 'workstation',
    price: 4500, priceLabel: '~$4,500 (configured)', os: 'Windows', releaseYear: 2026,
    cpu: 'Intel Core i9-14900K', cpuCores: '24-core/32-thread',
    gpu: 'NVIDIA RTX 5090', gpuVram: '24 GB GDDR7',
    ram: '64 GB DDR5-6400', ramType: 'DDR5',
    storage: '4 TB NVMe SSD (RAID-ready)',
    ports: 'Full ATX: Thunderbolt 5, USB4, PCIe 5.0 ×16',
    performanceScore: 100, efficiencyScore: 52, valueScore: 60, batteryScore: undefined,
    gradient: 'from-blue-400/20 to-indigo-800/30', icon: '🖥',
  },

  // ── COMPONENTS ───────────────────────────────────────────────────────────

  {
    id: 'cpu-m5-pro',
    name: 'Apple M5 Pro',
    brand: 'Apple', category: 'component', subtype: 'cpu',
    price: 0, priceLabel: 'In MacBook Pro / Mac Studio', os: 'N/A', releaseYear: 2026,
    cpu: 'Apple M5 Pro', cpuCores: '14-core (10P+4E)',
    gpu: '20-core GPU', gpuVram: 'Unified memory',
    ram: '24–64 GB Unified', storage: 'N/A',
    performanceScore: 88, efficiencyScore: 95, valueScore: 80,
    gradient: 'from-gray-400/20 to-slate-600/30', icon: '🧠', badge: 'Silicon',
  },

  {
    id: 'cpu-m5-max',
    name: 'Apple M5 Max',
    brand: 'Apple', category: 'component', subtype: 'cpu',
    price: 0, priceLabel: 'In MacBook Pro 16" / Mac Studio', os: 'N/A', releaseYear: 2026,
    cpu: 'Apple M5 Max', cpuCores: '16-core (12P+4E)',
    gpu: '40-core GPU', gpuVram: 'Unified memory',
    ram: '48–128 GB Unified', storage: 'N/A',
    performanceScore: 97, efficiencyScore: 93, valueScore: 72,
    gradient: 'from-neutral-500/20 to-gray-700/30', icon: '🧠',
  },

  {
    id: 'cpu-intel-cu9-295h',
    name: 'Intel Core Ultra 9 295H',
    brand: 'Intel', category: 'component', subtype: 'cpu',
    price: 650, priceLabel: '~$650', os: 'N/A', releaseYear: 2024,
    cpu: 'Intel Core Ultra 9 295H', cpuCores: '24-core (8P+16E)',
    gpu: 'Intel Arc 8-core', gpuVram: 'Shared',
    ram: 'Up to 96 GB LPDDR5X', storage: 'N/A',
    performanceScore: 82, efficiencyScore: 68, valueScore: 65,
    gradient: 'from-blue-400/20 to-cyan-600/30', icon: '🧠', badge: 'Lunar Lake',
  },

  {
    id: 'cpu-amd-ryzen-ai9-hx370',
    name: 'AMD Ryzen AI 9 HX 370',
    brand: 'AMD', category: 'component', subtype: 'cpu',
    price: 500, priceLabel: '~$500', os: 'N/A', releaseYear: 2024,
    cpu: 'AMD Ryzen AI 9 HX 370', cpuCores: '12-core (4P+8E) Strix Point',
    gpu: 'AMD Radeon 890M', gpuVram: 'Shared',
    ram: 'Up to 64 GB LPDDR5X', storage: 'N/A',
    performanceScore: 84, efficiencyScore: 74, valueScore: 76,
    gradient: 'from-red-400/20 to-orange-600/30', icon: '🧠', badge: 'Strix Point',
  },

  {
    id: 'gpu-rtx5090',
    name: 'NVIDIA GeForce RTX 5090',
    brand: 'NVIDIA', category: 'component', subtype: 'gpu',
    price: 1999, priceLabel: 'From $1,999', os: 'N/A', releaseYear: 2025,
    cpu: 'N/A', gpu: 'NVIDIA RTX 5090', gpuVram: '24 GB GDDR7',
    ram: 'N/A', storage: 'N/A',
    performanceScore: 100, efficiencyScore: 62, valueScore: 50,
    gradient: 'from-green-400/20 to-emerald-700/30', icon: '🎮', badge: 'Flagship',
  },

  {
    id: 'gpu-rtx5080',
    name: 'NVIDIA GeForce RTX 5080',
    brand: 'NVIDIA', category: 'component', subtype: 'gpu',
    price: 999, priceLabel: 'From $999', os: 'N/A', releaseYear: 2025,
    cpu: 'N/A', gpu: 'NVIDIA RTX 5080', gpuVram: '16 GB GDDR7',
    ram: 'N/A', storage: 'N/A',
    performanceScore: 88, efficiencyScore: 72, valueScore: 74,
    gradient: 'from-green-400/20 to-teal-700/30', icon: '🎮',
  },

  {
    id: 'gpu-rx9070xt',
    name: 'AMD Radeon RX 9070 XT',
    brand: 'AMD', category: 'component', subtype: 'gpu',
    price: 599, priceLabel: 'From $599', os: 'N/A', releaseYear: 2025,
    cpu: 'N/A', gpu: 'AMD RX 9070 XT', gpuVram: '16 GB GDDR6',
    ram: 'N/A', storage: 'N/A',
    performanceScore: 80, efficiencyScore: 82, valueScore: 88,
    gradient: 'from-red-400/20 to-orange-700/30', icon: '🎮', badge: 'Best Value GPU',
  },
];

// ─── Convenience filters ──────────────────────────────────────────────────────
export const LAPTOPS    = ALL_MODELS.filter(m => m.category === 'laptop');
export const DESKTOPS   = ALL_MODELS.filter(m => m.category === 'desktop');
export const COMPONENTS = ALL_MODELS.filter(m => m.category === 'component');

export function getModelById(id: string): ComputerModel | undefined {
  return ALL_MODELS.find(m => m.id === id);
}

// ─── Guides ───────────────────────────────────────────────────────────────────
export const GUIDES: Guide[] = [
  {
    id: 'g1',
    title: 'Best Laptop for Programming in 2026',
    excerpt: 'From Apple silicon to Snapdragon X Elite, we break down the top picks for software developers who demand speed, battery, and great displays.',
    category: 'Buying Guide',
    readTime: '8 min',
    gradient: 'from-blue-400/25 to-indigo-600/35',
    icon: '👨‍💻',
    publishDate: 'Mar 5, 2026',
    highlights: ['M5 Pro crushes compile times', 'ThinkPad X1 for Linux lovers', 'Surface Laptop 7 for .NET developers'],
  },
  {
    id: 'g2',
    title: 'GPU Buying Guide 2026: RTX 5000 vs AMD RX 9000',
    excerpt: 'NVIDIA raised the bar with RTX 5090, but AMD fights back with value. This guide helps you choose the right GPU for gaming, AI, or creative work.',
    category: 'GPU Guide',
    readTime: '10 min',
    gradient: 'from-green-400/25 to-emerald-700/35',
    icon: '🎮',
    publishDate: 'Feb 20, 2026',
    highlights: ['RTX 5090 is unmatched for 4K gaming', 'RX 9070 XT is the value king', 'RTX 5080 hits the sweet spot'],
  },
  {
    id: 'g3',
    title: 'Mac vs PC in 2026: A Fair Comparison',
    excerpt: 'We test and compare Apple silicon Macs against the best Windows laptops across performance, battery life, software, and total cost of ownership.',
    category: 'Comparison',
    readTime: '12 min',
    gradient: 'from-purple-400/25 to-pink-600/35',
    icon: '⚖',
    publishDate: 'Jan 30, 2026',
    highlights: ['M5 Max beats everything in efficiency', 'Windows wins for gaming', 'macOS still leads for creative pros'],
  },
  {
    id: 'g4',
    title: 'How to Read Laptop Specs (2026 Edition)',
    excerpt: 'TDP, LPDDR5X, ProMotion, unified memory — we demystify the jargon so you can make an informed decision without a computer science degree.',
    category: 'Beginner',
    readTime: '6 min',
    gradient: 'from-amber-400/25 to-orange-600/35',
    icon: '📖',
    publishDate: 'Jan 10, 2026',
    highlights: ['What "efficiency cores" actually mean', 'Unified vs dedicated VRAM', 'Why refresh rate matters for you'],
  },
  {
    id: 'g5',
    title: 'Best Budget Gaming Laptops 2026 (Under $2,000)',
    excerpt: 'You don\'t need to spend $4,500 for great gaming. The ASUS ROG Zephyrus G14 and others deliver RTX 5080 performance at sane prices.',
    category: 'Budget Guide',
    readTime: '7 min',
    gradient: 'from-red-400/25 to-rose-700/35',
    icon: '💰',
    publishDate: 'Dec 15, 2025',
    highlights: ['G14 is the pick at $2,499', 'OLED panels at this price are wild', 'Battery life trade-offs to know'],
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export const FAQS: FaqItem[] = [
  { id: 'f1', category: 'Comparing', question: 'How are performance scores calculated?', answer: 'Our scores are normalized across Geekbench 6 multi-core, Cinebench 2024, and real-world workload benchmarks. A score of 100 represents the highest-performing model in our database for that category. Scores are updated quarterly.' },
  { id: 'f2', category: 'Comparing', question: 'Can I compare laptops with desktops?', answer: 'Yes — the Compare Tool supports mixing categories. However, scores like battery and portability are only shown for laptops. Component comparisons (CPU vs CPU) focus on compute-specific metrics.' },
  { id: 'f3', category: 'Comparing', question: 'Why are Apple M5 efficiency scores so high?', answer: 'Apple M5 chips use a monolithic die with unified memory, eliminating the CPU-to-GPU data bus bottleneck. Combined with TSMC 3nm fabrication, they deliver exceptional performance-per-watt versus competing Intel and AMD laptop chips.' },
  { id: 'f4', category: 'Pricing', question: 'Are prices accurate and up to date?', answer: 'Prices shown are manufacturer suggested retail prices (MSRP) at launch in USD. They may not reflect current retail pricing, regional taxes, or promotions. Always verify on the manufacturer\'s website before purchasing.' },
  { id: 'f5', category: 'Pricing', question: 'Should I wait for the next generation?', answer: 'Generally, if a product was released in the last 6 months it represents current-gen value. Apple refreshes annually (M-series), while Intel and AMD tend to refresh every 12–18 months for laptop and desktop CPUs.' },
  { id: 'f6', category: 'Technical', question: 'What is unified memory vs dedicated VRAM?', answer: 'Unified memory (Apple M-series) is shared between CPU and GPU at very high bandwidth (up to 800 GB/s on M5 Max). Dedicated VRAM (NVIDIA, AMD GPUs) is physically separate and only accessible by the GPU. Both approaches have trade-offs in GPU-intensive tasks.' },
  { id: 'f7', category: 'Technical', question: 'What does TDP mean for laptops?', answer: 'Thermal Design Power (TDP) is the maximum power a processor is designed to consume under sustained load. Lower TDP means cooler, quieter operation but may limit peak performance. Laptops typically run chips at reduced TDP (15–45W) vs desktop variants (65–125W+).' },
  { id: 'f8', category: 'Technical', question: 'Is OLED better than Mini-LED for laptops?', answer: 'OLED offers perfect blacks, infinite contrast, and faster response times — ideal for media and color work. Mini-LED (like Apple\'s Liquid Retina XDR) is brighter, has no risk of burn-in, and better for sustained work in bright environments. Both are premium options.' },
  { id: 'f9', category: 'Platform', question: 'Which is better for software development: Mac or PC?', answer: 'Both are excellent. Macs run native Unix (macOS/Darwin), which aligns well with Linux servers, and Apple silicon performance is outstanding. Windows offers WSL2 (Windows Subsystem for Linux) for a similar Unix experience plus wider hardware choice. Many developers prefer Mac for the terminal experience.' },
  { id: 'f10', category: 'Platform', question: 'Can Macs run Windows or gaming?', answer: 'Yes, via Parallels virtualization (not native Boot Camp since M-series). Gaming on Mac is improving with Metal API and Apple\'s game porting toolkit, but the Windows/DirectX gaming library is vastly larger. Dedicated gaming laptops (ASUS ROG, Razer) remain superior for gaming.' },
];
