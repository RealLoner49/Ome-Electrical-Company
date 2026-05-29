import { useEffect, useState } from 'react';

export function useCart(auth, toast) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('ome-cart-pro') || '[]'));

  useEffect(() => localStorage.setItem('ome-cart-pro', JSON.stringify(cart)), [cart]);

  const add = (product) => {
    if (!auth.requireLogin('Login or create an account before adding products to cart.')) return;
    setCart((items) => {
      const found = items.find((entry) => entry.id === product.id);
      return found ? items.map((entry) => entry.id === product.id ? { ...entry, qty: entry.qty + 1 } : entry) : [...items, { ...product, qty: 1 }];
    });
    toast?.showToast?.(`${product.name || 'Product'} added to cart.`, 'success');
  };

  const setQty = (id, qty) => setCart((items) => {
    const target = items.find((entry) => entry.id === id);
    if (target && qty <= 0) toast?.showToast?.(`${target.name || 'Product'} removed from cart.`, 'info');
    return items.map((entry) => entry.id === id ? { ...entry, qty } : entry).filter((entry) => entry.qty > 0);
  });

  const clear = () => {
    setCart([]);
    toast?.showToast?.('Cart cleared.', 'info');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { cart, add, setQty, clear, subtotal, count: cart.reduce((sum, item) => sum + item.qty, 0) };
}
