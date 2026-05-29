# Supabase setup

Create a `products` table with these suggested columns:

- id: uuid, primary key, default gen_random_uuid()
- product_id: text
- name: text
- category: text
- price: numeric
- old_price: numeric, nullable
- stock: numeric
- badge: text
- image: text
- description: text
- tags: jsonb, default []
- specs: jsonb, default {}
- created_at: timestamptz, default now()

For admin-only writes, add Row Level Security policies so only your admin user can insert, update and delete.
Use `.env.example` to create your real `.env` locally and in Vercel.
