export const PRODUCTS = [
  {
    id: 'florence-satchel-04',
    name: 'The Florence Satchel No. 04',
    tagline: 'The Signature Heritage Brief-Satchel',
    price: 140,
    currency: 'USD',
    badge: 'Iconic Masterpiece',
    rating: 4.98,
    reviewsCount: 142,
    dimensions: '38cm (W) x 26cm (H) x 12cm (D)',
    weight: '1.24 kg',
    leatherType: 'Full-Grain Tuscan Vacchetta (1.8mm)',
    hardware: 'Hand-Forged Solid Antiqued Brass',
    description: 'Constructed from slow vegetable-tanned Tuscan calfskin and stitched with beeswax-conditioned linen thread. Features dual gussets, laptop compartment up to 14", and our signature contoured quick-release buckle.',
    colors: [
      { name: 'Tuscan Cognac', hex: '#955127', bg: 'bg-[#955127]', image: '/products/bag-cognac.png' },
      { name: 'Tuscan Rust', hex: '#7b2608', bg: 'bg-[#7b2608]', image: '/products/bag-rust.png' },
      { name: 'Espresso Noir', hex: '#241b16', bg: 'bg-[#241b16]', image: '/products/bag-noir.png' },
      { name: 'Oxblood Bordeaux', hex: '#581c20', bg: 'bg-[#581c20]', image: '/products/bag-oxblood.png' },
    ],
    details: [
      'Fits 14" MacBook Pro and daily document essentials',
      'Solid brass center roller buckle with quick-release magnet',
      'Reinforced arched carry handle with double rivet anchors',
      'Detachable padded leather shoulder strap with 5-point drop adjustment',
      'Hand-numbered limited atelier production batch'
    ]
  },
  {
    id: 'verona-briefcase-02',
    name: 'The Verona Executive Folio',
    tagline: 'Tailored for the Modern Polymath',
    price: 165,
    currency: 'USD',
    badge: 'Limited Run',
    rating: 4.95,
    reviewsCount: 88,
    dimensions: '41cm (W) x 29cm (H) x 9cm (D)',
    weight: '1.38 kg',
    leatherType: 'Bespoke Boxcalf with Glazed Patina',
    hardware: 'Brushed Champagne Gold Hardware',
    description: 'A slim, structured executive briefcase designed for effortless transition from boardroom to transatlantic travel. Includes a dedicated trolley strap.',
    colors: [
      { name: 'Espresso Noir', hex: '#1c1613', bg: 'bg-[#1c1613]' },
      { name: 'Cognac Saddle', hex: '#b86831', bg: 'bg-[#b86831]' },
      { name: 'Midnight Navy', hex: '#192534', bg: 'bg-[#192534]' },
    ],
    details: [
      'Padded compartment for 16" MacBook Pro',
      'Concealed magnetic phone pocket and passport slot',
      'Solid brass custom padlock and leather clochette',
      'Raw edge hand-painted five times with artisanal beeswax edge stain'
    ]
  },
  {
    id: 'siena-weekender-07',
    name: 'The Siena Grand Weekender',
    tagline: '48 Hours of Uncompromising Luxury',
    price: 195,
    currency: 'USD',
    badge: 'Heritage Carryall',
    rating: 5.0,
    reviewsCount: 64,
    dimensions: '52cm (W) x 32cm (H) x 24cm (D)',
    weight: '1.85 kg',
    leatherType: 'Supple Milled Grain Bull Leather',
    hardware: 'Heavy Solid Cast Brass Zippers & Rings',
    description: 'Designed for spontaneous getaways. Generously proportioned with water-resistant cotton twill lining, internal zipped wet pocket, and reinforced corners.',
    colors: [
      { name: 'Cognac Saddle', hex: '#a65b26', bg: 'bg-[#a65b26]' },
      { name: 'Olive Drab', hex: '#39402e', bg: 'bg-[#39402e]' },
      { name: 'Deep Mahogany', hex: '#3d1f18', bg: 'bg-[#3d1f18]' },
    ],
    details: [
      'Meets international carry-on overhead luggage requirements',
      'Heavy-duty two-way YKK Excella brass zipper with leather pulls',
      'Separate base shoe/laundry compartment',
      'Solid brass bottom studs for ground protection'
    ]
  },
  {
    id: 'lucca-crossbody-01',
    name: 'The Lucca Courier Crossbody',
    tagline: 'Featherlight Everyday Utility',
    price: 120,
    currency: 'USD',
    badge: 'Everyday Essential',
    rating: 4.92,
    reviewsCount: 119,
    dimensions: '24cm (W) x 18cm (H) x 7cm (D)',
    weight: '0.62 kg',
    leatherType: 'Aniline Vegetable-Tanned Cowhide',
    hardware: 'Vintage Matte Gold Accents',
    description: 'The compact daily companion. Contoured to hang close to the hip or chest, offering fast access to camera, wallet, and sunglasses.',
    colors: [
      { name: 'Cognac Saddle', hex: '#b86831', bg: 'bg-[#b86831]' },
      { name: 'Desert Sand', hex: '#b8966c', bg: 'bg-[#b8966c]' },
      { name: 'Espresso Noir', hex: '#211812', bg: 'bg-[#211812]' },
    ],
    details: [
      'Accommodates iPad Mini, Kindle, sunglasses case and keys',
      'Fast magnetic flap closure beneath ornamental buckle',
      'Anti-theft rear zippered passport slot',
      'Silky microfiber velvet scratch-free interior'
    ]
  }
];

export const CRAFT_HOTSPOTS = [
  {
    id: 1,
    title: '1.8mm Full-Grain Tuscan Leather',
    category: 'Material',
    coords: { x: '42%', y: '45%' },
    desc: 'Sourced from centuries-old Santa Croce tanneries. Tanned using chestnut and mimosa barks over 60 days, yielding a buttery hand and an extraordinary patina that deepens with age.',
    specs: 'Vegetable-tanned • Thickness 1.8mm • Zero synthetic coatings'
  },
  {
    id: 2,
    title: 'Solid Forged Brass Hardware',
    category: 'Hardware',
    coords: { x: '58%', y: '68%' },
    desc: 'Each buckle, D-ring, and rivet is sand-cast and hand-polished by third-generation metalsmiths in Florence. Tested to withstand over 250 lbs of tensile pull.',
    specs: '100% Solid Brass • Anti-corrosion lacquer • Hand-stamped serials'
  },
  {
    id: 3,
    title: 'Hand-Stitched Saddle Seam',
    category: 'Assembly',
    coords: { x: '52%', y: '28%' },
    desc: 'Two needles working simultaneously in opposite directions with wax-saturated French linen thread. If one stitch ever breaks, the seam remains intact forever.',
    specs: '8 Stitches per Inch • French Waxed Linen • Lifetime Repair Promise'
  },
  {
    id: 4,
    title: 'Ergonomic Arched Grip Handle',
    category: 'Structure',
    coords: { x: '50%', y: '16%' },
    desc: 'Built around a hand-carved core of dense saddle skirting leather, shaped to distribute weight comfortably across the palm even under heavy daily loads.',
    specs: 'Layered leather core • Double solid-brass reinforcement pins'
  }
];

export const BRAND_STATS = [
  { value: 'Firenze', label: 'Born in Tuscany', sub: 'Pure Italian bench mastery' },
  { value: '68 hrs', label: 'Per Handcrafted Bag', sub: 'Meticulous bench assembly' },
  { value: '100%', label: 'Vegetable Tanned', sub: 'Non-toxic, organic bark extracts' },
  { value: 'Lifetime', label: 'Artisanal Warranty', sub: 'Free repair and reconditioning' },
];
