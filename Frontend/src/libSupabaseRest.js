const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const PRODUCTS_TABLE = import.meta.env.VITE_SUPABASE_PRODUCTS_TABLE || 'products';

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com').toLowerCase();
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const headers = (token, prefer) => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  ...(prefer ? { Prefer: prefer } : {}),
});

const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem('ome-session') || 'null');
  } catch {
    return null;
  }
};

const saveSession = (session) => {
  if (session?.access_token) localStorage.setItem('ome-session', JSON.stringify(session));
};

const authToken = () => {
  return readSession()?.access_token || SUPABASE_ANON_KEY;
};

const tablePath = (query = '') => `/rest/v1/${encodeURIComponent(PRODUCTS_TABLE)}${query}`;

async function refreshSession() {
  const refreshToken = readSession()?.refresh_token;
  if (!refreshToken) throw new Error('Your Supabase session expired. Please logout and login again.');

  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    localStorage.removeItem('ome-session');
    const message = data?.msg || data?.message || data?.error_description || data?.error || 'Session refresh failed';
    throw new Error(`${message}. Please login again.`);
  }
  saveSession(data);
  return data;
}

async function request(path, options = {}, retry = true) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const res = await fetch(`${SUPABASE_URL}${path}`, options);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (res.status === 401 && retry && !path.startsWith('/auth/v1/')) {
    const session = await refreshSession();
    const retryOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${session.access_token}`,
      },
    };
    return request(path, retryOptions, false);
  }
  if (!res.ok) {
    const message = data?.msg || data?.message || data?.error_description || data?.error || res.statusText || 'Request failed';
    throw new Error(`${message} (${res.status})`);
  }
  return data;
}

export const supaAuth = {
  async login(email, password) {
    const data = await request('/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });
    saveSession(data);
    return data;
  },
  async signup(name, email, password) {
    const data = await request('/auth/v1/signup', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password, data: { full_name: name } }),
    });
    saveSession(data);
    return data;
  },
  session() {
    return readSession();
  },
  user() {
    return this.session()?.user || null;
  },
  logout() {
    localStorage.removeItem('ome-session');
  },
};

const normalizeProduct = (p) => ({
  id: p.id || p.product_id,
  product_id: p.product_id || p.id,
  name: p.name || '',
  category: p.category || 'general',
  price: Number(p.price || 0),
  oldPrice: Number(p.oldPrice || p.old_price || 0),
  rating: Number(p.rating || 4.8),
  badge: p.badge || 'In stock',
  stock: Number(p.stock ?? 10),
  image: p.image || p.image_url || '/images/new-arrival-hero.svg',
  description: p.description || '',
  tags: Array.isArray(p.tags) ? p.tags : [],
  specs: p.specs || {},
  sku: p.sku || '',
  eta: p.eta || '',
});

const productPayload = (product) => ({
  product_id: product.product_id || product.id || crypto.randomUUID(),
  name: product.name || '',
  category: product.category || 'general',
  price: Number(product.price || 0),
  old_price: Number(product.oldPrice || product.old_price || 0),
  badge: product.badge || 'In stock',
  stock: Number.isFinite(Number(product.stock)) ? Number(product.stock) : 0,
  image_url: product.image || product.image_url || '/images/new-arrival-hero.svg',
  description: product.description || '',
  rating: Number(product.rating || 4.8),
  tags: Array.isArray(product.tags) ? product.tags : [],
  specs: product.specs || {},
  sku: product.sku || '',
  eta: product.eta || '',
});

export const supaProducts = {
  async list() {
    const data = await request(tablePath('?select=*&order=created_at.desc'), { headers: headers(authToken()) });
    return (data || []).map(normalizeProduct);
  },
  async create(product) {
    const payload = productPayload(product);
    const data = await request(tablePath(), {
      method: 'POST', headers: headers(authToken(), 'return=representation'), body: JSON.stringify(payload),
    });
    return normalizeProduct(data?.[0] || payload);
  },
  async update(id, product) {
    const payload = productPayload(product);
    const data = await request(tablePath(`?id=eq.${encodeURIComponent(id)}`), {
      method: 'PATCH', headers: headers(authToken(), 'return=representation'), body: JSON.stringify(payload),
    });
    return normalizeProduct(data?.[0] || payload);
  },
  async remove(id, productId) {
    const attempts = [productId && tablePath(`?product_id=eq.${encodeURIComponent(productId)}`), id && tablePath(`?id=eq.${encodeURIComponent(id)}`)].filter(Boolean);
    let lastError;
    for (const path of attempts) {
      try {
        const deleted = await request(path, { method: 'DELETE', headers: headers(authToken(), 'return=representation') });
        if (!Array.isArray(deleted) || deleted.length) return true;
        lastError = new Error('Supabase returned no deleted row. Check product_id/id match and DELETE RLS policy.');
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('Product was not found in Supabase.');
  },
  async removeLocalOnly(id) {
    await request(tablePath(`?id=eq.${encodeURIComponent(id)}`), { method: 'DELETE', headers: headers(authToken(), 'return=minimal') });
    return true;
  },
};
