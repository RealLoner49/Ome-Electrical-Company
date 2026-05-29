import { useState } from 'react';
import { categories, formatPrice } from '../../data/products';
import './Shop.css';

function ProductCard({ p, onAdd }) {
  return <article className="card shop-card"><div className="img"><img src={p.image} /><span>{p.badge}</span></div><div className="card-body"><small>{p.product_id || p.id}</small><h3>{p.name}</h3><p>{p.description}</p><div className="price"><b>{formatPrice(p.price)}</b>{p.oldPrice ? <s>{formatPrice(p.oldPrice)}</s> : null}</div><button onClick={onAdd}>Add to cart</button></div></article>;
}

export default function Shop({ products, cart }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const shown = products.filter((p) => (cat === 'all' || p.category === cat) && `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q.toLowerCase()));

  return <main className="shop-page"><section className="shop-hero"><div><p className="eyebrow">Shop the grid</p><h1>Find the exact electrical part without slowing the job.</h1><p>Search cables, breakers, lighting, sockets and industrial accessories with product IDs kept visible for clean dispatch.</p></div><div className="shop-console"><b>{shown.length}</b><span>products matching</span><small>{cat === 'all' ? 'All categories' : categories.find((c) => c.slug === cat)?.name}</small></div></section><section className="shop-filters"><input placeholder="Search product, cable, breaker..." value={q} onChange={(e) => setQ(e.target.value)} /><select value={cat} onChange={(e) => setCat(e.target.value)}><option value="all">All categories</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></section><section className="grid shop-grid">{shown.map((p) => <ProductCard key={p.id} p={p} onAdd={() => cart.add(p)} />)}</section>{!shown.length && <section className="empty-state"><h2>No products found</h2><p>Try another category or search term.</p></section>}</main>;
}
