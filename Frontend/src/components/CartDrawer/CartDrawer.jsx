import React from 'react';
import './CartDrawer.css';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { items, count, removeOneByName, removeItemById, clearCart, drawerOpen, closeCart, addQuantity } = useCart();

  const groups = items.reduce((acc, it) => {
    const key = it.name || it.id;
    if (!acc[key]) acc[key] = { ...it, qty: 0, ids: [] };
    acc[key].qty += 1;
    acc[key].ids.push(it.id);
    return acc;
  }, {});

  const rows = Object.values(groups);
  const subtotal = rows.reduce((s, r) => {
    const price = Number(String(r.price).replace(/[^0-9]/g, '')) || 0;
    return s + price * r.qty;
  }, 0);

  return (
    <div className={`cart-drawer ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
      <div className="cart-drawer__backdrop" onClick={closeCart} />
      <aside className="cart-drawer__panel">
        <header className="cart-drawer__header">
          <h3>Shopping Cart</h3>
          <div className="cart-drawer__meta">Items in Cart: {count} products</div>
          <button className="cart-drawer__close" onClick={closeCart}>×</button>
        </header>

        <div className="cart-drawer__content">
          {rows.length === 0 && <div className="cart-empty">Your cart is empty.</div>}

          {rows.map(r => (
            <div className="cart-item" key={r.name}>
              <div className="cart-item__left">
                {r.image && <img src={r.image} alt={r.name} />}
              </div>
              <div className="cart-item__body">
                <div className="cart-item__title">{r.name}</div>
                <div className="cart-item__price">{r.price}</div>
                <div className="cart-item__controls">
                  <button className="qty-btn" onClick={() => removeOneByName(r.name)} disabled={r.qty === 1}>−</button>
                  <span className="qty-display">{r.qty}</span>
                  <button className="qty-btn" onClick={() => addQuantity(r)}>+</button>
                </div>
              </div>
              <div className="cart-item__remove">
                <button className="btn--remove" onClick={() => r.ids.forEach(id => removeItemById(id))}>×</button>
              </div>
            </div>
          ))}
        </div>

        <footer className="cart-drawer__footer">
          <div className="cart-drawer__subtotal">Sub Total: <strong>₦{subtotal.toLocaleString()}</strong></div>
          <div className="cart-drawer__actions">
            <button className="btn btn--muted" onClick={clearCart}>Clear</button>
            <button className="btn btn--primary" onClick={() => { window.location.hash = '#/checkout'; }}>Checkout Now</button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
