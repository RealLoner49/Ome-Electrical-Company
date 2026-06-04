import { useCallback, useEffect, useMemo, useState } from 'react';
import { categories, formatPrice } from '../../data/products';
import './Shop.css';

const DEFAULT_PRODUCT_IMAGE = '/images/new-arrival-hero.svg';

function getProductImages(product) {
  const images = Array.isArray(product.images) ? product.images : [];
  return Array.from(new Set([...images, product.image, product.image_url].filter(Boolean))).slice(0, 3);
}

function ProductCard({ p, onAdd, onPreview }) {
  const thumbnail = getProductImages(p)[0] || DEFAULT_PRODUCT_IMAGE;

  return (
    <article className="card shop-card">
      <button type="button" className="img shop-image-button" onClick={onPreview} aria-label={`View ${p.name} images`}>
        <img src={thumbnail} alt={p.name} />
        <span>{p.badge}</span>
      </button>
      <div className="card-body">
        <small>{p.product_id || p.id}</small>
        <h3>{p.name}</h3>
        <p>{p.description}</p>
        <div className="price">
          <b>{formatPrice(p.price)}</b>
          {p.oldPrice ? <s>{formatPrice(p.oldPrice)}</s> : null}
        </div>
        <button onClick={onAdd}>Add to cart</button>
      </div>
    </article>
  );
}

export default function Shop({ products, cart }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [preview, setPreview] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    const savedTarget = sessionStorage.getItem('ome-shop-target');
    if (!savedTarget) return;

    try {
      const target = JSON.parse(savedTarget);
      if (target.category) setCat(target.category);
      if (target.query) setQ(target.query);
    } catch {
      setCat('all');
    } finally {
      sessionStorage.removeItem('ome-shop-target');
    }
  }, []);

  const shown = products.filter(
    (p) =>
      (cat === 'all' || p.category === cat) &&
      `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q.toLowerCase())
  );

  const previewImages = useMemo(() => (preview ? getProductImages(preview) : []), [preview]);
  const activePreviewImage = previewImages[previewIndex] || previewImages[0] || DEFAULT_PRODUCT_IMAGE;
  const hasMultipleImages = previewImages.length > 1;

  const movePreview = useCallback((direction) => {
    if (!previewImages.length) return;
    setPreviewIndex((current) => (current + direction + previewImages.length) % previewImages.length);
  }, [previewImages.length]);

  const openPreview = (product) => {
    setPreview(product);
    setPreviewIndex(0);
  };

  useEffect(() => {
    if (!preview) return undefined;
    const handleKeys = (event) => {
      if (event.key === 'Escape') setPreview(null);
      if (event.key === 'ArrowLeft') movePreview(-1);
      if (event.key === 'ArrowRight') movePreview(1);
    };
    addEventListener('keydown', handleKeys);
    return () => removeEventListener('keydown', handleKeys);
  }, [movePreview, preview]);

  return (
    <main className="shop-page">
      <section className="shop-hero">
        <div>
          <p className="eyebrow">Shop the grid</p>
          <h1>Find the exact electrical part without slowing the job.</h1>
          <p>Search cables, breakers, lighting, sockets and industrial accessories with product IDs kept visible for clean dispatch.</p>
        </div>
        <div className="shop-console">
          <b>{shown.length}</b>
          <span>products matching</span>
          <small>{cat === 'all' ? 'All categories' : categories.find((c) => c.slug === cat)?.name}</small>
        </div>
      </section>

      <section className="shop-filters">
        <input placeholder="Search product, cable, breaker..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </section>

      <section className="grid shop-grid">
        {shown.map((p) => (
          <ProductCard key={p.id} p={p} onAdd={() => cart.add(p)} onPreview={() => openPreview(p)} />
        ))}
      </section>

      {!shown.length && (
        <section className="empty-state">
          <h2>No products found</h2>
          <p>Try another category or search term.</p>
        </section>
      )}

      {preview && (
        <div className="image-modal" role="dialog" aria-modal="true" onClick={() => setPreview(null)}>
          <div className="image-modal-frame" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="image-modal-close" onClick={() => setPreview(null)} aria-label="Close image preview">
              x
            </button>

            {hasMultipleImages && (
              <button type="button" className="image-modal-arrow image-modal-prev" onClick={() => movePreview(-1)} aria-label="Previous product image">
                ‹
              </button>
            )}

            <img src={activePreviewImage} alt={`${preview.name} preview ${previewIndex + 1}`} />

            {hasMultipleImages && (
              <button type="button" className="image-modal-arrow image-modal-next" onClick={() => movePreview(1)} aria-label="Next product image">
                ›
              </button>
            )}

            <div className="image-modal-details">
              <b>{preview.name}</b>
              <span>
                {previewIndex + 1} / {previewImages.length}
              </span>
            </div>

            {hasMultipleImages && (
              <div className="image-modal-thumbs">
                {previewImages.map((image, index) => (
                  <button
                    type="button"
                    className={index === previewIndex ? 'active' : ''}
                    key={`${image}-${index}`}
                    onClick={() => setPreviewIndex(index)}
                    aria-label={`Show ${preview.name} image ${index + 1}`}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
