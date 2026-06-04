import { useState } from 'react';
import { categories, formatPrice } from '../../data/products';
import { ADMIN_EMAIL, isSupabaseConfigured } from '../../libSupabaseRest';
import { useToast } from '../../context/ToastContext.jsx';

function uid(prefix = 'OME') {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${Date.now().toString().slice(-5)}`;
}

function priceInput(value) {
  if (value === '' || value == null) return '';
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function priceNumber(value) {
  return Number(String(value).replace(/,/g, '')) || 0;
}

const DEFAULT_PRODUCT_IMAGE = '/images/new-arrival-hero.svg';
const MAX_PRODUCT_IMAGES = 3;
const MAX_IMAGE_SIZE = 1200;
const IMAGE_QUALITY = 0.82;

function productImages(product, { includeFallback = false } = {}) {
  const images = Array.isArray(product.images) ? product.images : [];
  const realImages = [...images, product.image, product.image_url].filter((image) => image && image !== DEFAULT_PRODUCT_IMAGE);
  const uniqueImages = Array.from(new Set(realImages)).slice(0, MAX_PRODUCT_IMAGES);
  return uniqueImages.length || !includeFallback ? uniqueImages : [DEFAULT_PRODUCT_IMAGE];
}

function missingProductFields(product) {
  const missing = [];

  if (!String(product.product_id || '').trim()) missing.push('Product ID');
  if (!String(product.name || '').trim()) missing.push('Product name');
  if (priceNumber(product.price) <= 0) missing.push('Price');
  if (String(product.stock ?? '').trim() === '' || Number(product.stock) < 0) missing.push('Stock');
  if (!String(product.category || '').trim()) missing.push('Category');
  if (!productImages(product).length) missing.push('Product image');
  if (!String(product.description || '').trim()) missing.push('Description');

  return missing;
}

function resizeProductImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Image could not be read.'));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error('Image could not be loaded.'));
      image.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_SIZE / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
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
    image: DEFAULT_PRODUCT_IMAGE,
    images: [],
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
    const missing = missingProductFields(form);

    if (missing.length) {
      toast?.showToast?.(`Please complete: ${missing.join(', ')}.`, 'error');
      return;
    }

    setBusy(true);

    try {
      const payload = {
        ...form,
        price: priceNumber(form.price),
        stock: Number(form.stock),
        product_id: form.product_id || uid('PRD'),
        image: productImages(form)[0] || DEFAULT_PRODUCT_IMAGE,
        images: productImages(form),
      };

      if (editId) {
        await updateProduct(editId, payload);
      } else {
        await createProduct(payload);
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
      price: priceInput(product.price),
      category: product.category || 'cables-wires',
      stock: product.stock ?? 10,
      badge: product.badge || 'New',
      image: product.image || DEFAULT_PRODUCT_IMAGE,
      images: productImages(product),
      description: product.description || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function pickImage(event) {
    const currentImages = productImages(form);
    const openSlots = MAX_PRODUCT_IMAGES - currentImages.length;
    const files = Array.from(event.target.files || []).slice(0, openSlots);
    if (!files.length) return;

    Promise.all(files.map(resizeProductImage))
      .then((newImages) =>
        setForm((current) => {
          const images = [...productImages(current), ...newImages].slice(0, MAX_PRODUCT_IMAGES);
          return { ...current, image: images[0], images };
        })
      )
      .catch(() => {
        toast?.showToast?.('Image could not be prepared. Try another picture.', 'error');
      });

    event.target.value = '';
  }

  function removeImage(index) {
    setForm((current) => {
      const images = productImages(current).filter((_, imageIndex) => imageIndex !== index);
      return { ...current, image: images[0] || DEFAULT_PRODUCT_IMAGE, images };
    });
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
            required
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
              inputMode="numeric"
              placeholder="Price"
              value={form.price}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d,]/g, '');
                setForm({ ...form, price: value });
              }}
            />

            <input
              required
              type="number"
              min="0"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>

          <select
            required
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
            <input id="admin-product-image" type="file" accept="image/*" multiple onChange={pickImage} />
            <label htmlFor="admin-product-image">
              {form.image ? <img src={form.image} alt="Product preview" /> : <span>+</span>}
              <b>{form.image ? 'Change product images' : 'Add product images'}</b>
              <small>Select up to 3 pictures</small>
            </label>
            <div className="admin-image-thumbs">
              {productImages(form).map((image, index) => (
                <button type="button" key={`${image}-${index}`} onClick={() => removeImage(index)} aria-label={`Remove product image ${index + 1}`}>
                  <img src={image} alt={`Product preview ${index + 1}`} />
                  <span>x</span>
                </button>
              ))}
            </div>
          </div>

          <textarea
            required
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
                <img src={productImages(p, { includeFallback: true })[0]} alt={p.name} />

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
