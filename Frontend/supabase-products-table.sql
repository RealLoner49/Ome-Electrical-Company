-- Run this whole file in Supabase SQL Editor.
-- It creates the product table used by the shop/admin page, then seeds it
-- with the same products currently inside src/data/products.js.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  product_id text unique not null,
  name text not null,
  category text not null default 'general',
  price numeric not null default 0,
  old_price numeric not null default 0,
  rating numeric not null default 4.8,
  badge text not null default 'In stock',
  stock integer not null default 0,
  image_url text,
  description text,
  tags jsonb not null default '[]'::jsonb,
  specs jsonb not null default '{}'::jsonb,
  sku text,
  eta text,
  created_at timestamptz not null default now()
);

alter table public.products add column if not exists rating numeric not null default 4.8;
alter table public.products add column if not exists tags jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists specs jsonb not null default '{}'::jsonb;
alter table public.products add column if not exists sku text;
alter table public.products add column if not exists eta text;

alter table public.products enable row level security;

drop policy if exists "Anyone can read products" on public.products;
create policy "Anyone can read products"
on public.products
for select
to anon, authenticated
using (true);

drop policy if exists "Admin can create products" on public.products;
create policy "Admin can create products"
on public.products
for insert
to authenticated
with check (auth.jwt() ->> 'email' = 'omeelectrical28@gmail.com');

drop policy if exists "Admin can update products" on public.products;
create policy "Admin can update products"
on public.products
for update
to authenticated
using (auth.jwt() ->> 'email' = 'omeelectrical28@gmail.com')
with check (auth.jwt() ->> 'email' = 'omeelectrical28@gmail.com');

drop policy if exists "Admin can delete products" on public.products;
create policy "Admin can delete products"
on public.products
for delete
to authenticated
using (auth.jwt() ->> 'email' = 'omeelectrical28@gmail.com');

insert into public.products (
  product_id, name, category, price, old_price, rating, badge, stock,
  image_url, description, tags, specs, sku, eta
) values
  ('p-copper-25', 'Copper Cable 2.5mm', 'cables-wires', 18500, 21000, 4.8, 'Best Seller', 10, '/images/Copper Cable 2.5mm.jpg', 'Pure copper cable designed for clean conductivity, stable load handling, and dependable installation work.', '["popular","home","wiring"]'::jsonb, '{"Length":"100m coil","Material":"100% copper core","Insulation":"Flame-retardant PVC","Use":"Lighting and socket wiring"}'::jsonb, 'OME-0001', 'Delivered in 24 - 72 hrs'),
  ('p-armoured-16', 'Armoured Cable 16mm', 'cables-wires', 92500, 105000, 4.7, 'Industrial', 4, '/images/Copper Cable 2.5mm.jpg', 'Tough armoured cable for demanding outdoor and commercial power routing.', '["industrial","outdoor","heavy-duty"]'::jsonb, '{"Core":"4 core","Shielding":"Steel wire armoured","Grade":"Outdoor rated","Use":"Commercial installations"}'::jsonb, 'OME-0002', 'Pickup available today'),
  ('p-flex-15', 'Flexible Cable 1.5mm', 'cables-wires', 12200, 15000, 4.6, 'Fast Moving', 8, '/images/Copper Cable 2.5mm.jpg', 'Soft-bend flexible cable ideal for appliance rewiring and control panels.', '["budget","appliances","panels"]'::jsonb, '{"Length":"100m","Finish":"Flexible stranded copper","Use":"Appliances and panels","Grade":"Heat resistant"}'::jsonb, 'OME-0003', 'Delivered in 24 - 72 hrs'),
  ('p-copper-4mm', 'Copper Cable 4mm', 'cables-wires', 26500, 31500, 4.9, 'Hot', 10, '/images/Copper Cable 2.5mm.jpg', 'Heavy-duty copper cable for higher load residential and commercial wiring.', '["premium","home","heavy wiring"]'::jsonb, '{"Length":"100m coil","Material":"Copper core","Insulation":"PVC insulated","Use":"Heavy socket and AC wiring"}'::jsonb, 'OME-0004', 'Pickup available today'),
  ('p-speaker-cable', 'Transparent Speaker Cable', 'cables-wires', 7800, 9200, 4.4, 'Audio', 4, '/images/Copper Cable 2.5mm.jpg', 'Clear insulated cable for audio systems, speakers, and low-voltage connections.', '["audio","home","accessory"]'::jsonb, '{"Length":"50m roll","Type":"Twin cable","Use":"Speakers and sound systems","Jacket":"Transparent PVC"}'::jsonb, 'OME-0005', 'Delivered in 24 - 72 hrs'),
  ('p-led-panel', 'LED Panel Light 24W', 'lighting-fixtures', 14500, 17000, 4.7, 'New', 8, '/images/Electrician In Jamshedpur _ OOTS.jpg', 'Slim panel light with even spread and clean ceiling integration for offices and modern homes.', '["office","ceiling","energy-saving"]'::jsonb, '{"Wattage":"24W","Color":"Cool white","Shape":"Square recessed","Lifespan":"30,000 hours"}'::jsonb, 'OME-0006', 'Pickup available today'),
  ('p-wall-light', 'Modern Wall Light', 'lighting-fixtures', 18900, 22500, 4.5, 'Hot Deal', 10, '/images/Electrician In Jamshedpur _ OOTS.jpg', 'Decorative wall fixture that adds character while keeping power usage light.', '["decorative","interior","modern"]'::jsonb, '{"Finish":"Matte black","Mount":"Wall bracket","Use":"Hallway and bedroom","Lamp":"LED compatible"}'::jsonb, 'OME-0007', 'Delivered in 24 - 72 hrs'),
  ('p-flood-100', 'Flood Light 100W', 'lighting-fixtures', 23800, 27500, 4.8, 'Outdoor', 4, '/images/Electrician In Jamshedpur _ OOTS.jpg', 'High-output flood light for compounds, storefronts, and night work visibility.', '["security","outdoor","compound"]'::jsonb, '{"Wattage":"100W","Protection":"IP65","Beam":"Wide angle","Body":"Aluminium housing"}'::jsonb, 'OME-0008', 'Pickup available today'),
  ('p-chandelier', 'Modern Chandelier', 'lighting-fixtures', 65000, 78000, 4.9, 'Luxury', 8, '/images/Electrician In Jamshedpur _ OOTS.jpg', 'Statement ceiling chandelier for modern living rooms, lounges, and hotel interiors.', '["premium","decorative","ceiling"]'::jsonb, '{"Type":"Ceiling mount","Finish":"Gold and crystal","Use":"Living room and hotel spaces","Lamp":"LED compatible"}'::jsonb, 'OME-0009', 'Delivered in 24 - 72 hrs'),
  ('p-led-strip', 'LED Strip Light 5m', 'lighting-fixtures', 11200, 13500, 4.6, 'Trending', 10, '/images/Electrician In Jamshedpur _ OOTS.jpg', 'Flexible LED strip for ceilings, shelves, signage, and decorative lighting effects.', '["decorative","strip","modern"]'::jsonb, '{"Length":"5m","Color":"Warm white","Power":"12V adapter","Use":"Decor and ambience"}'::jsonb, 'OME-0010', 'Pickup available today'),
  ('p-smart-switch', 'Smart Touch Switch', 'switches-sockets', 26200, 31000, 4.6, 'Smart Home', 4, '/images/IndustrialCircuit Breaker 20A.jpg', 'Glass-finish smart switch with touch controls for polished, modern interiors.', '["smart","premium","modern"]'::jsonb, '{"Gang":"3 gang","Faceplate":"Tempered glass","Feature":"Touch control","Voltage":"220-240V"}'::jsonb, 'OME-0011', 'Delivered in 24 - 72 hrs'),
  ('p-double-socket', 'Double Power Socket', 'switches-sockets', 8400, 9900, 4.4, 'Essential', 8, '/images/IndustrialCircuit Breaker 20A.jpg', 'Reliable double socket with a neat finish for residential and office projects.', '["home","socket","essential"]'::jsonb, '{"Type":"13A double socket","Finish":"White matte","Safety":"Child-safe shutters","Use":"Indoor"}'::jsonb, 'OME-0012', 'Pickup available today'),
  ('p-switch-combo', 'Switch + Socket Combo', 'switches-sockets', 11200, 13200, 4.5, 'Builder Choice', 10, '/images/IndustrialCircuit Breaker 20A.jpg', 'A practical combination unit that trims clutter and saves wall space.', '["builder","home","combo"]'::jsonb, '{"Layout":"1 switch + 1 socket","Material":"Fireproof PC","Mount":"Flush","Use":"Residential"}'::jsonb, 'OME-0013', 'Delivered in 24 - 72 hrs'),
  ('p-usb-socket', 'USB Wall Socket', 'switches-sockets', 14500, 17500, 4.7, 'Trending', 4, '/images/IndustrialCircuit Breaker 20A.jpg', 'Modern wall socket with built-in USB ports for fast charging and cleaner spaces.', '["usb","modern","charging"]'::jsonb, '{"Type":"13A socket","Ports":"2 USB ports","Finish":"White gloss","Use":"Bedroom and office"}'::jsonb, 'OME-0014', 'Pickup available today'),
  ('p-weatherproof-socket', 'Weatherproof Outdoor Socket', 'switches-sockets', 17800, 20500, 4.6, 'Outdoor', 8, '/images/IndustrialCircuit Breaker 20A.jpg', 'Weather-resistant socket for patios, gardens, compounds, and outdoor equipment.', '["outdoor","weatherproof","safety"]'::jsonb, '{"Rating":"IP66","Type":"13A socket","Cover":"Protective lid","Use":"Outdoor power access"}'::jsonb, 'OME-0015', 'Delivered in 24 - 72 hrs'),
  ('p-breaker-20a', 'Industrial Circuit Breaker 20A', 'power-distribution', 16800, 19500, 4.8, 'Trusted', 10, '/images/IndustrialCircuit Breaker 20A.jpg', 'Stable trip response and durable internals for protection you can trust.', '["safety","panel","breaker"]'::jsonb, '{"Rating":"20A","Poles":"Single pole","Response":"Fast trip","Use":"Panel protection"}'::jsonb, 'OME-0016', 'Pickup available today'),
  ('p-changeover-63', 'Changeover Switch 63A', 'power-distribution', 34500, 39500, 4.7, 'Heavy Duty', 4, '/images/Heavy Duty Extension Box.jpg', 'Manual changeover solution for generator and mains power management.', '["generator","backup","heavy-duty"]'::jsonb, '{"Capacity":"63A","Body":"Industrial grade","Use":"Home and office backup","Safety":"Arc-resistant contacts"}'::jsonb, 'OME-0017', 'Delivered in 24 - 72 hrs'),
  ('p-db-8way', '8-Way Distribution Board', 'power-distribution', 29100, 33000, 4.6, 'Installer Pick', 8, '/images/Heavy Duty Extension Box.jpg', 'Compact board for structured circuit organization and easy maintenance.', '["panel","installer","distribution"]'::jsonb, '{"Ways":"8","Mount":"Surface","Finish":"Powder coated","Use":"Residential distribution"}'::jsonb, 'OME-0018', 'Pickup available today'),
  ('p-breaker-40a', 'Industrial Circuit Breaker 40A', 'power-distribution', 24000, 28200, 4.9, 'Heavy Duty', 10, '/images/IndustrialCircuit Breaker 20A.jpg', 'High-capacity circuit breaker for heavier loads and professional panels.', '["industrial","breaker","safety"]'::jsonb, '{"Rating":"40A","Poles":"Single pole","Use":"Heavy load protection","Response":"Thermal magnetic trip"}'::jsonb, 'OME-0019', 'Delivered in 24 - 72 hrs'),
  ('p-db-12way', '12-Way Distribution Board', 'power-distribution', 38600, 44500, 4.7, 'Pro Install', 4, '/images/Heavy Duty Extension Box.jpg', 'Larger distribution board for organized wiring in offices and bigger homes.', '["panel","distribution","professional"]'::jsonb, '{"Ways":"12","Mount":"Surface or flush","Material":"Powder-coated steel","Use":"Office and residential panels"}'::jsonb, 'OME-0020', 'Pickup available today'),
  ('p-ext-box', 'Heavy Duty Extension Box', 'extensions-plugs', 22400, 26000, 4.9, 'Featured', 8, '/images/Heavy Duty Extension Box.jpg', 'Rugged extension box built for workshops, event setups, and hard-running devices.', '["workshop","heavy-duty","extension"]'::jsonb, '{"Sockets":"4 outlets","Cable":"5m heavy-duty","Protection":"Surge guard","Use":"Worksite and office"}'::jsonb, 'OME-0021', 'Delivered in 24 - 72 hrs'),
  ('p-industrial-plug', 'Industrial Plug 32A', 'extensions-plugs', 15600, 18800, 4.5, 'Worksite', 10, '/images/Heavy Duty Extension Box.jpg', 'Industrial-grade plug for stable, secure high-load connections.', '["industrial","plug","worksite"]'::jsonb, '{"Capacity":"32A","Rating":"IP44","Body":"Impact resistant","Use":"Industrial equipment"}'::jsonb, 'OME-0022', 'Pickup available today'),
  ('p-junction-box', 'Waterproof Junction Box', 'extensions-plugs', 9800, 11500, 4.4, 'Utility', 4, '/images/Heavy Duty Extension Box.jpg', 'Compact enclosure for safe cable jointing in demanding environments.', '["junction","outdoor","waterproof"]'::jsonb, '{"Seal":"Waterproof","Material":"ABS","Use":"Outdoor cable joints","Mount":"Surface"}'::jsonb, 'OME-0023', 'Delivered in 24 - 72 hrs'),
  ('p-surge-ext', 'Surge Extension Cable', 'extensions-plugs', 18500, 21800, 4.8, 'Protection', 8, '/images/Heavy Duty Extension Box.jpg', 'Extension cable with built-in surge protection for electronics and appliances.', '["safe","surge","home"]'::jsonb, '{"Length":"3m","Outlets":"5 outlets","Protection":"Surge protected","Use":"TV, PC, fridge, office devices"}'::jsonb, 'OME-0024', 'Pickup available today'),
  ('p-travel-adapter', 'Universal Travel Adapter', 'extensions-plugs', 12900, 15500, 4.5, 'Portable', 10, '/images/Heavy Duty Extension Box.jpg', 'Compact travel adapter for multi-standard plug conversion and mobile charging.', '["travel","adapter","charging"]'::jsonb, '{"Ports":"USB + AC output","Input":"Universal","Use":"Travel and mobile devices","Safety":"Fuse protected"}'::jsonb, 'OME-0025', 'Delivered in 24 - 72 hrs'),
  ('p-stabilizer-5kva', '5KVA Stabilizer', 'stabilizers-protection', 142000, 158000, 4.8, 'Premium', 4, '/images/Stablizer (1).jpg', 'Voltage regulation unit that protects valuable appliances from erratic supply swings.', '["power","protection","stabilizer"]'::jsonb, '{"Capacity":"5KVA","Display":"Digital meter","Response":"Automatic regulation","Use":"Home and office electronics"}'::jsonb, 'OME-0026', 'Pickup available today'),
  ('p-surge-guard', 'Surge Protector Guard', 'stabilizers-protection', 13400, 16000, 4.6, 'Protection', 8, '/images/Stablizer (1).jpg', 'First-line defense against surges and unstable mains behaviour.', '["surge","protection","appliances"]'::jsonb, '{"Mode":"Auto cut-off","Display":"LED status","Use":"TV and fridge","Delay":"Adjustable reconnect"}'::jsonb, 'OME-0027', 'Delivered in 24 - 72 hrs'),
  ('p-voltage-monitor', 'Digital Voltage Monitor', 'stabilizers-protection', 19500, 23200, 4.5, 'Monitoring', 10, '/images/Stablizer (1).jpg', 'Real-time monitoring device for installers and electrical maintenance teams.', '["monitoring","panel","voltage"]'::jsonb, '{"Screen":"Digital LCD","Accuracy":"High precision","Use":"Panel monitoring","Alarm":"Voltage alert"}'::jsonb, 'OME-0028', 'Pickup available today'),
  ('p-ups', 'Home UPS Backup', 'stabilizers-protection', 98000, 118000, 4.7, 'Backup', 4, '/images/Stablizer (1).jpg', 'Backup power solution for routers, TVs, workstations, and essential devices.', '["backup","home","power"]'::jsonb, '{"Battery":"12V compatible","Output":"Pure sine wave","Use":"Home and office backup","Runtime":"Depends on battery size"}'::jsonb, 'OME-0029', 'Delivered in 24 - 72 hrs'),
  ('p-fridge-guard', 'Fridge Guard Protector', 'stabilizers-protection', 11800, 14500, 4.6, 'Appliance Care', 8, '/images/Stablizer (1).jpg', 'Dedicated voltage protection device for refrigerators and cooling appliances.', '["fridge","protection","home"]'::jsonb, '{"Use":"Fridge and freezer","Delay":"3-minute delay","Protection":"High/low voltage cut-off","Indicator":"LED status"}'::jsonb, 'OME-0030', 'Pickup available today')
on conflict (product_id) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  old_price = excluded.old_price,
  rating = excluded.rating,
  badge = excluded.badge,
  stock = excluded.stock,
  image_url = excluded.image_url,
  description = excluded.description,
  tags = excluded.tags,
  specs = excluded.specs,
  sku = excluded.sku,
  eta = excluded.eta;
