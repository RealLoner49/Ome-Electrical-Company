// Update products and categories here.
// Use public image paths like /images/example.jpg after placing files in public/images.
// category must match one of the category slug values below.

// ============================
// 🗂️ PRODUCT CATEGORIES
// ============================
export const categories = [
  {
    slug: 'cables-wires',
    name: 'Cables & Wires',
    blurb: 'Copper-core reliability for homes, offices, and industrial installations.',
    hero: '/images/Copper Cable 2.5mm.jpg',
  },
  {
    slug: 'lighting-fixtures',
    name: 'Lighting Fixtures',
    blurb: 'Layered lighting solutions that sharpen spaces and soften energy costs.',
    hero: '/images/Electrician In Jamshedpur _ OOTS.jpg',
  },
  {
    slug: 'switches-sockets',
    name: 'Switches & Sockets',
    blurb: 'Clean finishing hardware with durability baked into every click.',
    hero: '/images/IndustrialCircuit Breaker 20A.jpg',
  },
  {
    slug: 'power-distribution',
    name: 'Power Distribution',
    blurb: 'Protection and load control for projects that cannot afford guesswork.',
    hero: '/images/Heavy Duty Extension Box.jpg',
  },
  {
    slug: 'extensions-plugs',
    name: 'Extensions & Adapters',
    blurb: 'Heavy duty access points for workshops, retail spaces, and homes.',
    hero: '/images/Heavy Duty Extension Box.jpg',
  },
  {
    slug: 'stabilizers-protection',
    name: 'Stabilizers & Protection',
    blurb: 'Power conditioning gear that keeps appliances safe from voltage drama.',
    hero: '/images/Stablizer (1).jpg',
  },
];

const rawProducts = [
  // ============================
  // 🔌 CABLES & WIRES
  // ============================
  {
    id: 'p-copper-25',
    name: 'Copper Cable 2.5mm',
    category: 'cables-wires',
    price: 18500,
    oldPrice: 21000,
    rating: 4.8,
    badge: 'Best Seller',
    tags: ['popular', 'home', 'wiring'],
    image: '/images/Copper Cable 2.5mm.jpg',
    images: ['/images/Copper Cable 2.5mm.jpg'],
    description: 'Pure copper cable designed for clean conductivity, stable load handling, and dependable installation work.',
    specs: {
      Length: '100m coil',
      Material: '100% copper core',
      Insulation: 'Flame-retardant PVC',
      Use: 'Lighting and socket wiring',
    },
  },
  {
    id: 'p-armoured-16',
    name: 'Armoured Cable 16mm',
    category: 'cables-wires',
    price: 92500,
    oldPrice: 105000,
    rating: 4.7,
    badge: 'Industrial',
    tags: ['industrial', 'outdoor', 'heavy-duty'],
    image: '/images/Copper Cable 2.5mm.jpg',
    images: ['/images/Copper Cable 2.5mm.jpg'],
    description: 'Tough armoured cable for demanding outdoor and commercial power routing.',
    specs: {
      Core: '4 core',
      Shielding: 'Steel wire armoured',
      Grade: 'Outdoor rated',
      Use: 'Commercial installations',
    },
  },
  {
    id: 'p-flex-15',
    name: 'Flexible Cable 1.5mm',
    category: 'cables-wires',
    price: 12200,
    oldPrice: 15000,
    rating: 4.6,
    badge: 'Fast Moving',
    tags: ['budget', 'appliances', 'panels'],
    image: '/images/Copper Cable 2.5mm.jpg',
    images: ['/images/Copper Cable 2.5mm.jpg'],
    description: 'Soft-bend flexible cable ideal for appliance rewiring and control panels.',
    specs: {
      Length: '100m',
      Finish: 'Flexible stranded copper',
      Use: 'Appliances and panels',
      Grade: 'Heat resistant',
    },
  },
  {
    id: 'p-copper-4mm',
    name: 'Copper Cable 4mm',
    category: 'cables-wires',
    price: 26500,
    oldPrice: 31500,
    rating: 4.9,
    badge: 'Hot',
    tags: ['premium', 'home', 'heavy wiring'],
    image: '/images/Copper Cable 2.5mm.jpg',
    images: ['/images/Copper Cable 2.5mm.jpg'],
    description: 'Heavy-duty copper cable for higher load residential and commercial wiring.',
    specs: {
      Length: '100m coil',
      Material: 'Copper core',
      Insulation: 'PVC insulated',
      Use: 'Heavy socket and AC wiring',
    },
  },
  {
    id: 'p-speaker-cable',
    name: 'Transparent Speaker Cable',
    category: 'cables-wires',
    price: 7800,
    oldPrice: 9200,
    rating: 4.4,
    badge: 'Audio',
    tags: ['audio', 'home', 'accessory'],
    image: '/images/Copper Cable 2.5mm.jpg',
    images: ['/images/Copper Cable 2.5mm.jpg'],
    description: 'Clear insulated cable for audio systems, speakers, and low-voltage connections.',
    specs: {
      Length: '50m roll',
      Type: 'Twin cable',
      Use: 'Speakers and sound systems',
      Jacket: 'Transparent PVC',
    },
  },

  // ============================
  // 💡 LIGHTING FIXTURES
  // ============================
  {
    id: 'p-led-panel',
    name: 'LED Panel Light 24W',
    category: 'lighting-fixtures',
    price: 14500,
    oldPrice: 17000,
    rating: 4.7,
    badge: 'New',
    tags: ['office', 'ceiling', 'energy-saving'],
    image: '/images/Electrician In Jamshedpur _ OOTS.jpg',
    images: ['/images/Electrician In Jamshedpur _ OOTS.jpg'],
    description: 'Slim panel light with even spread and clean ceiling integration for offices and modern homes.',
    specs: {
      Wattage: '24W',
      Color: 'Cool white',
      Shape: 'Square recessed',
      Lifespan: '30,000 hours',
    },
  },
  {
    id: 'p-wall-light',
    name: 'Modern Wall Light',
    category: 'lighting-fixtures',
    price: 18900,
    oldPrice: 22500,
    rating: 4.5,
    badge: 'Hot Deal',
    tags: ['decorative', 'interior', 'modern'],
    image: '/images/Electrician In Jamshedpur _ OOTS.jpg',
    images: ['/images/Electrician In Jamshedpur _ OOTS.jpg'],
    description: 'Decorative wall fixture that adds character while keeping power usage light.',
    specs: {
      Finish: 'Matte black',
      Mount: 'Wall bracket',
      Use: 'Hallway and bedroom',
      Lamp: 'LED compatible',
    },
  },
  {
    id: 'p-flood-100',
    name: 'Flood Light 100W',
    category: 'lighting-fixtures',
    price: 23800,
    oldPrice: 27500,
    rating: 4.8,
    badge: 'Outdoor',
    tags: ['security', 'outdoor', 'compound'],
    image: '/images/Electrician In Jamshedpur _ OOTS.jpg',
    images: ['/images/Electrician In Jamshedpur _ OOTS.jpg'],
    description: 'High-output flood light for compounds, storefronts, and night work visibility.',
    specs: {
      Wattage: '100W',
      Protection: 'IP65',
      Beam: 'Wide angle',
      Body: 'Aluminium housing',
    },
  },
  {
    id: 'p-chandelier',
    name: 'Modern Chandelier',
    category: 'lighting-fixtures',
    price: 65000,
    oldPrice: 78000,
    rating: 4.9,
    badge: 'Luxury',
    tags: ['premium', 'decorative', 'ceiling'],
    image: '/images/Electrician In Jamshedpur _ OOTS.jpg',
    images: ['/images/Electrician In Jamshedpur _ OOTS.jpg'],
    description: 'Statement ceiling chandelier for modern living rooms, lounges, and hotel interiors.',
    specs: {
      Type: 'Ceiling mount',
      Finish: 'Gold and crystal',
      Use: 'Living room and hotel spaces',
      Lamp: 'LED compatible',
    },
  },
  {
    id: 'p-led-strip',
    name: 'LED Strip Light 5m',
    category: 'lighting-fixtures',
    price: 11200,
    oldPrice: 13500,
    rating: 4.6,
    badge: 'Trending',
    tags: ['decorative', 'strip', 'modern'],
    image: '/images/Electrician In Jamshedpur _ OOTS.jpg',
    images: ['/images/Electrician In Jamshedpur _ OOTS.jpg'],
    description: 'Flexible LED strip for ceilings, shelves, signage, and decorative lighting effects.',
    specs: {
      Length: '5m',
      Color: 'Warm white',
      Power: '12V adapter',
      Use: 'Decor and ambience',
    },
  },

  // ============================
  // 🔘 SWITCHES & SOCKETS
  // ============================
  {
    id: 'p-smart-switch',
    name: 'Smart Touch Switch',
    category: 'switches-sockets',
    price: 26200,
    oldPrice: 31000,
    rating: 4.6,
    badge: 'Smart Home',
    tags: ['smart', 'premium', 'modern'],
    image: '/images/IndustrialCircuit Breaker 20A.jpg',
    images: ['/images/IndustrialCircuit Breaker 20A.jpg'],
    description: 'Glass-finish smart switch with touch controls for polished, modern interiors.',
    specs: {
      Gang: '3 gang',
      Faceplate: 'Tempered glass',
      Feature: 'Touch control',
      Voltage: '220-240V',
    },
  },
  {
    id: 'p-double-socket',
    name: 'Double Power Socket',
    category: 'switches-sockets',
    price: 8400,
    oldPrice: 9900,
    rating: 4.4,
    badge: 'Essential',
    tags: ['home', 'socket', 'essential'],
    image: '/images/IndustrialCircuit Breaker 20A.jpg',
    images: ['/images/IndustrialCircuit Breaker 20A.jpg'],
    description: 'Reliable double socket with a neat finish for residential and office projects.',
    specs: {
      Type: '13A double socket',
      Finish: 'White matte',
      Safety: 'Child-safe shutters',
      Use: 'Indoor',
    },
  },
  {
    id: 'p-switch-combo',
    name: 'Switch + Socket Combo',
    category: 'switches-sockets',
    price: 11200,
    oldPrice: 13200,
    rating: 4.5,
    badge: 'Builder Choice',
    tags: ['builder', 'home', 'combo'],
    image: '/images/IndustrialCircuit Breaker 20A.jpg',
    images: ['/images/IndustrialCircuit Breaker 20A.jpg'],
    description: 'A practical combination unit that trims clutter and saves wall space.',
    specs: {
      Layout: '1 switch + 1 socket',
      Material: 'Fireproof PC',
      Mount: 'Flush',
      Use: 'Residential',
    },
  },
  {
    id: 'p-usb-socket',
    name: 'USB Wall Socket',
    category: 'switches-sockets',
    price: 14500,
    oldPrice: 17500,
    rating: 4.7,
    badge: 'Trending',
    tags: ['usb', 'modern', 'charging'],
    image: '/images/IndustrialCircuit Breaker 20A.jpg',
    images: ['/images/IndustrialCircuit Breaker 20A.jpg'],
    description: 'Modern wall socket with built-in USB ports for fast charging and cleaner spaces.',
    specs: {
      Type: '13A socket',
      Ports: '2 USB ports',
      Finish: 'White gloss',
      Use: 'Bedroom and office',
    },
  },
  {
    id: 'p-weatherproof-socket',
    name: 'Weatherproof Outdoor Socket',
    category: 'switches-sockets',
    price: 17800,
    oldPrice: 20500,
    rating: 4.6,
    badge: 'Outdoor',
    tags: ['outdoor', 'weatherproof', 'safety'],
    image: '/images/IndustrialCircuit Breaker 20A.jpg',
    images: ['/images/IndustrialCircuit Breaker 20A.jpg'],
    description: 'Weather-resistant socket for patios, gardens, compounds, and outdoor equipment.',
    specs: {
      Rating: 'IP66',
      Type: '13A socket',
      Cover: 'Protective lid',
      Use: 'Outdoor power access',
    },
  },

  // ============================
  // ⚡ POWER DISTRIBUTION
  // ============================
  {
    id: 'p-breaker-20a',
    name: 'Industrial Circuit Breaker 20A',
    category: 'power-distribution',
    price: 16800,
    oldPrice: 19500,
    rating: 4.8,
    badge: 'Trusted',
    tags: ['safety', 'panel', 'breaker'],
    image: '/images/IndustrialCircuit Breaker 20A.jpg',
    images: ['/images/IndustrialCircuit Breaker 20A.jpg'],
    description: 'Stable trip response and durable internals for protection you can trust.',
    specs: {
      Rating: '20A',
      Poles: 'Single pole',
      Response: 'Fast trip',
      Use: 'Panel protection',
    },
  },
  {
    id: 'p-changeover-63',
    name: 'Changeover Switch 63A',
    category: 'power-distribution',
    price: 34500,
    oldPrice: 39500,
    rating: 4.7,
    badge: 'Heavy Duty',
    tags: ['generator', 'backup', 'heavy-duty'],
    image: '/images/Heavy Duty Extension Box.jpg',
    images: ['/images/Heavy Duty Extension Box.jpg'],
    description: 'Manual changeover solution for generator and mains power management.',
    specs: {
      Capacity: '63A',
      Body: 'Industrial grade',
      Use: 'Home and office backup',
      Safety: 'Arc-resistant contacts',
    },
  },
  {
    id: 'p-db-8way',
    name: '8-Way Distribution Board',
    category: 'power-distribution',
    price: 29100,
    oldPrice: 33000,
    rating: 4.6,
    badge: 'Installer Pick',
    tags: ['panel', 'installer', 'distribution'],
    image: '/images/Heavy Duty Extension Box.jpg',
    images: ['/images/Heavy Duty Extension Box.jpg'],
    description: 'Compact board for structured circuit organization and easy maintenance.',
    specs: {
      Ways: '8',
      Mount: 'Surface',
      Finish: 'Powder coated',
      Use: 'Residential distribution',
    },
  },
  {
    id: 'p-breaker-40a',
    name: 'Industrial Circuit Breaker 40A',
    category: 'power-distribution',
    price: 24000,
    oldPrice: 28200,
    rating: 4.9,
    badge: 'Heavy Duty',
    tags: ['industrial', 'breaker', 'safety'],
    image: '/images/IndustrialCircuit Breaker 20A.jpg',
    images: ['/images/IndustrialCircuit Breaker 20A.jpg'],
    description: 'High-capacity circuit breaker for heavier loads and professional panels.',
    specs: {
      Rating: '40A',
      Poles: 'Single pole',
      Use: 'Heavy load protection',
      Response: 'Thermal magnetic trip',
    },
  },
  {
    id: 'p-db-12way',
    name: '12-Way Distribution Board',
    category: 'power-distribution',
    price: 38600,
    oldPrice: 44500,
    rating: 4.7,
    badge: 'Pro Install',
    tags: ['panel', 'distribution', 'professional'],
    image: '/images/Heavy Duty Extension Box.jpg',
    images: ['/images/Heavy Duty Extension Box.jpg'],
    description: 'Larger distribution board for organized wiring in offices and bigger homes.',
    specs: {
      Ways: '12',
      Mount: 'Surface or flush',
      Material: 'Powder-coated steel',
      Use: 'Office and residential panels',
    },
  },

  // ============================
  // 🔌 EXTENSIONS & ADAPTERS
  // ============================
  {
    id: 'p-ext-box',
    name: 'Heavy Duty Extension Box',
    category: 'extensions-plugs',
    price: 22400,
    oldPrice: 26000,
    rating: 4.9,
    badge: 'Featured',
    tags: ['workshop', 'heavy-duty', 'extension'],
    image: '/images/Heavy Duty Extension Box.jpg',
    images: ['/images/Heavy Duty Extension Box.jpg'],
    description: 'Rugged extension box built for workshops, event setups, and hard-running devices.',
    specs: {
      Sockets: '4 outlets',
      Cable: '5m heavy-duty',
      Protection: 'Surge guard',
      Use: 'Worksite and office',
    },
  },
  {
    id: 'p-industrial-plug',
    name: 'Industrial Plug 32A',
    category: 'extensions-plugs',
    price: 15600,
    oldPrice: 18800,
    rating: 4.5,
    badge: 'Worksite',
    tags: ['industrial', 'plug', 'worksite'],
    image: '/images/Heavy Duty Extension Box.jpg',
    images: ['/images/Heavy Duty Extension Box.jpg'],
    description: 'Industrial-grade plug for stable, secure high-load connections.',
    specs: {
      Capacity: '32A',
      Rating: 'IP44',
      Body: 'Impact resistant',
      Use: 'Industrial equipment',
    },
  },
  {
    id: 'p-junction-box',
    name: 'Waterproof Junction Box',
    category: 'extensions-plugs',
    price: 9800,
    oldPrice: 11500,
    rating: 4.4,
    badge: 'Utility',
    tags: ['junction', 'outdoor', 'waterproof'],
    image: '/images/Heavy Duty Extension Box.jpg',
    images: ['/images/Heavy Duty Extension Box.jpg'],
    description: 'Compact enclosure for safe cable jointing in demanding environments.',
    specs: {
      Seal: 'Waterproof',
      Material: 'ABS',
      Use: 'Outdoor cable joints',
      Mount: 'Surface',
    },
  },
  {
    id: 'p-surge-ext',
    name: 'Surge Extension Cable',
    category: 'extensions-plugs',
    price: 18500,
    oldPrice: 21800,
    rating: 4.8,
    badge: 'Protection',
    tags: ['safe', 'surge', 'home'],
    image: '/images/Heavy Duty Extension Box.jpg',
    images: ['/images/Heavy Duty Extension Box.jpg'],
    description: 'Extension cable with built-in surge protection for electronics and appliances.',
    specs: {
      Length: '3m',
      Outlets: '5 outlets',
      Protection: 'Surge protected',
      Use: 'TV, PC, fridge, office devices',
    },
  },
  {
    id: 'p-travel-adapter',
    name: 'Universal Travel Adapter',
    category: 'extensions-plugs',
    price: 12900,
    oldPrice: 15500,
    rating: 4.5,
    badge: 'Portable',
    tags: ['travel', 'adapter', 'charging'],
    image: '/images/Heavy Duty Extension Box.jpg',
    images: ['/images/Heavy Duty Extension Box.jpg'],
    description: 'Compact travel adapter for multi-standard plug conversion and mobile charging.',
    specs: {
      Ports: 'USB + AC output',
      Input: 'Universal',
      Use: 'Travel and mobile devices',
      Safety: 'Fuse protected',
    },
  },

  // ============================
  // 🔋 STABILIZERS & PROTECTION
  // ============================
  {
    id: 'p-stabilizer-5kva',
    name: '5KVA Stabilizer',
    category: 'stabilizers-protection',
    price: 142000,
    oldPrice: 158000,
    rating: 4.8,
    badge: 'Premium',
    tags: ['power', 'protection', 'stabilizer'],
    image: '/images/Stablizer (1).jpg',
    images: ['/images/Stablizer (1).jpg'],
    description: 'Voltage regulation unit that protects valuable appliances from erratic supply swings.',
    specs: {
      Capacity: '5KVA',
      Display: 'Digital meter',
      Response: 'Automatic regulation',
      Use: 'Home and office electronics',
    },
  },
  {
    id: 'p-surge-guard',
    name: 'Surge Protector Guard',
    category: 'stabilizers-protection',
    price: 13400,
    oldPrice: 16000,
    rating: 4.6,
    badge: 'Protection',
    tags: ['surge', 'protection', 'appliances'],
    image: '/images/Stablizer (1).jpg',
    images: ['/images/Stablizer (1).jpg'],
    description: 'First-line defense against surges and unstable mains behaviour.',
    specs: {
      Mode: 'Auto cut-off',
      Display: 'LED status',
      Use: 'TV and fridge',
      Delay: 'Adjustable reconnect',
    },
  },
  {
    id: 'p-voltage-monitor',
    name: 'Digital Voltage Monitor',
    category: 'stabilizers-protection',
    price: 19500,
    oldPrice: 23200,
    rating: 4.5,
    badge: 'Monitoring',
    tags: ['monitoring', 'panel', 'voltage'],
    image: '/images/Stablizer (1).jpg',
    images: ['/images/Stablizer (1).jpg'],
    description: 'Real-time monitoring device for installers and electrical maintenance teams.',
    specs: {
      Screen: 'Digital LCD',
      Accuracy: 'High precision',
      Use: 'Panel monitoring',
      Alarm: 'Voltage alert',
    },
  },
  {
    id: 'p-ups',
    name: 'Home UPS Backup',
    category: 'stabilizers-protection',
    price: 98000,
    oldPrice: 118000,
    rating: 4.7,
    badge: 'Backup',
    tags: ['backup', 'home', 'power'],
    image: '/images/Stablizer (1).jpg',
    images: ['/images/Stablizer (1).jpg'],
    description: 'Backup power solution for routers, TVs, workstations, and essential devices.',
    specs: {
      Battery: '12V compatible',
      Output: 'Pure sine wave',
      Use: 'Home and office backup',
      Runtime: 'Depends on battery size',
    },
  },
  {
    id: 'p-fridge-guard',
    name: 'Fridge Guard Protector',
    category: 'stabilizers-protection',
    price: 11800,
    oldPrice: 14500,
    rating: 4.6,
    badge: 'Appliance Care',
    tags: ['fridge', 'protection', 'home'],
    image: '/images/Stablizer (1).jpg',
    images: ['/images/Stablizer (1).jpg'],
    description: 'Dedicated voltage protection device for refrigerators and cooling appliances.',
    specs: {
      Use: 'Fridge and freezer',
      Delay: '3-minute delay',
      Protection: 'High/low voltage cut-off',
      Indicator: 'LED status',
    },
  },
];

export const products = rawProducts.map((product, index) => ({
  ...product,
  stock: index % 3 === 0 ? 'In Stock' : index % 3 === 1 ? 'Limited Stock' : 'Ready to Ship',
  eta: index % 2 === 0 ? 'Delivered in 24 - 72 hrs' : 'Pickup available today',
  sku: `OME-${String(index + 1).padStart(4, '0')}`,
}));

export const featuredProducts = products.slice(0, 8);

export const trendingProducts = products.filter((product) =>
  product.tags?.some((tag) => ['popular', 'trending', 'premium', 'smart'].includes(tag))
);

export const discountedProducts = products.filter((product) => product.oldPrice && product.oldPrice > product.price);

export const groupedProducts = {
  cables: products.filter((product) => product.category === 'cables-wires'),
  lighting: products.filter((product) => product.category === 'lighting-fixtures'),
  sockets: products.filter((product) => product.category === 'switches-sockets'),
  powerDistribution: products.filter((product) => product.category === 'power-distribution'),
  extensions: products.filter((product) => product.category === 'extensions-plugs'),
  stabilizers: products.filter((product) => product.category === 'stabilizers-protection'),
};

export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

export const getCategoryBySlug = (slug) =>
  categories.find((category) => category.slug === slug);

export const getProductById = (id) =>
  products.find((product) => product.id === id);

export const getProductsByCategory = (slug) =>
  products.filter((product) => product.category === slug);

export const getProductsByTag = (tag) =>
  products.filter((product) => product.tags?.includes(tag));

export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) return products;

  return products.filter((product) => {
    const searchableText = [
      product.name,
      product.category,
      product.badge,
      product.description,
      ...(product.tags || []),
      ...Object.values(product.specs || {}),
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(searchTerm);
  });
};