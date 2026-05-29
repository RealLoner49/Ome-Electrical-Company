import { useState } from 'react';
import { categories, formatPrice } from '../../data/products';
import { ADMIN_EMAIL, isSupabaseConfigured } from '../../libSupabaseRest';
import { useToast } from '../../context/ToastContext.jsx';

function uid(prefix = 'OME') {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${Date.now().toString().slice(-5)}`;
}

export default function Admin({ auth, products, createProduct, updateProduct, deleteProduct }) {
  const toast = useToast();

  const blank = {
    product_id: '',
    name: '',
    price: '',
    category: 'cables-wires',
    stock: 10,
    badge: 'New',
    image: '/images/new-arrival-hero.svg',
    description: '',
  };

  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);

  const stockNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
  const stockTotal = products.reduce((sum, product) => sum + stockNumber(product.stock), 0);
  const lowStock = products.filter((product) => stockNumber(product.stock) <= 5).length;

  const list = products.filter((p) =>
    `${p.name} ${p.product_id || p.id}`.toLowerCase().includes(q.toLowerCase())
  );

  if (!auth.isAdmin) {
    return (
      <main className="admin-page">
        <section className="admin-gate">
          <div>
            <p className="eyebrow">Admin access</p>
            <h1>Sign in to manage OME products.</h1>
            <p>Use the admin account configured as {ADMIN_EMAIL}.</p>
            <button
              onClick={() => {
                auth.setAuthMode('login');
                auth.setAuthOpen(true);
              }}
            >
              Admin login
            </button>
          </div>
          <div className="admin-lock">
            <b>OME</b>
            <span>secure admin</span>
          </div>
        </section>
      </main>
    );
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        product_id: form.product_id || uid('PRD'),
      };

      if (editId) {
        await updateProduct(editId, payload);
        toast?.showToast?.('Product updated successfully.', 'success');
      } else {
        await createProduct(payload);
        toast?.showToast?.('Product added successfully.', 'success');
      }

      setForm(blank);
      setEditId(null);
    } catch (error) {
      console.warn(error);

      const message = error?.message || '';

      if (message.toLowerCase().includes('could not find the table')) {
        toast?.showToast?.('Products table is missing in Supabase. Create the products table first.', 'error');
      } else if (message.toLowerCase().includes('row-level security')) {
        toast?.showToast?.('Supabase blocked this action. Check your products table RLS policy.', 'error');
      } else {
        toast?.showToast?.('Product could not be saved. Please check Supabase and try again.', 'error');
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(product) {
    const confirmDelete = await toast?.showConfirm?.(
      `Are you sure you want to delete "${product.name}"?`,
      { type: 'error', cancelLabel: 'Cancel', confirmLabel: 'Yes' }
    );
    if (!confirmDelete) return;

    setBusy(true);

    try {
      await deleteProduct(product.id, product.product_id);
      toast?.showToast?.('Product deleted successfully.', 'success');
    } catch (error) {
      console.warn(error);

      const message = error?.message || '';

      if (message.toLowerCase().includes('no deleted row')) {
        toast?.showToast?.(
          'This product is showing on the site but does not exist in Supabase yet. Seed or add it to Supabase first.',
          'error'
        );
      } else if (message.toLowerCase().includes('could not find the table')) {
        toast?.showToast?.('Products table is missing in Supabase. Create the products table first.', 'error');
      } else {
        toast?.showToast?.('Product could not be deleted. Please check Supabase and try again.', 'error');
      }
    } finally {
      setBusy(false);
    }
  }

  function startEdit(product) {
    setEditId(product.id);
    setForm({
      product_id: product.product_id || product.id || '',
      name: product.name || '',
      price: product.price || '',
      category: product.category || 'cables-wires',
      stock: product.stock ?? 10,
      badge: product.badge || 'New',
      image: product.image || '/images/new-arrival-hero.svg',
      description: product.description || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function pickImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, image: reader.result }));
    reader.readAsDataURL(file);
  }

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div>
          <p className="eyebrow">Admin command center</p>
          <h1>Manage products without digging around.</h1>
          <p>
            {isSupabaseConfigured
              ? 'Connected mode: changes go to Supabase.'
              : 'Demo mode: add Supabase env keys to make changes permanent online.'}
          </p>
        </div>

        <div className="admin-status">
          <b>{isSupabaseConfigured ? 'Live' : 'Demo'}</b>
          <span>{auth.user?.email}</span>
        </div>
      </section>

      <section className="admin-metrics">
        <article>
          <b>{products.length}</b>
          <span>Products</span>
        </article>
        <article>
          <b>{stockTotal}</b>
          <span>Total stock</span>
        </article>
        <article>
          <b>{lowStock}</b>
          <span>Low stock</span>
        </article>
        <article>
          <b>{list.length}</b>
          <span>Search results</span>
        </article>
      </section>

      <section className="admin-layout admin-layout-pro">
        <form className="panel form admin-form" onSubmit={save}>
          <div className="admin-form-head">
            <div>
              <p className="eyebrow">{editId ? 'Editing product' : 'New product'}</p>
              <h3>{editId ? 'Update product' : 'Add product'}</h3>
            </div>

            {editId && (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setEditId(null);
                  setForm(blank);
                }}
              >
                Cancel
              </button>
            )}
          </div>

          <input
            placeholder="Product ID"
            value={form.product_id || ''}
            onChange={(e) => setForm({ ...form, product_id: e.target.value })}
          />

          <input
            required
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <div className="admin-form-row">
            <input
              required
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="admin-image-picker">
            <input id="admin-product-image" type="file" accept="image/*" onChange={pickImage} />
            <label htmlFor="admin-product-image">
              {form.image ? <img src={form.image} alt="Product preview" /> : <span>+</span>}
              <b>{form.image ? 'Change product image' : 'Add product image'}</b>
            </label>
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button disabled={busy}>
            {busy ? 'Please wait...' : editId ? 'Save changes' : 'Add product'}
          </button>
        </form>

        <div className="panel admin-products">
          <div className="admin-search">
            <div>
              <p className="eyebrow">Inventory</p>
              <h3>Product list</h3>
            </div>

            <input
              className="wide"
              placeholder="Search existing product..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="admin-list">
            {list.map((p) => (
              <div className="admin-item admin-item-pro" key={p.id}>
                <img src={p.image} alt={p.name} />

                <div>
                  <b>{p.name}</b>
                  <small>
                    {p.product_id || p.id} - {formatPrice(p.price)} - Stock {p.stock ?? 'N/A'}
                  </small>
                </div>

                <button disabled={busy} onClick={() => startEdit(p)}>
                  Edit
                </button>

                <button disabled={busy} className="danger" onClick={() => handleDelete(p)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
