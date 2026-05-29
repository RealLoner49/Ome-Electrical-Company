import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products } from '../data/products';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const toast = useToast();
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('ome-cart-v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ome-cart-v2', JSON.stringify(items));
  }, [items]);

  function addToCart(product, quantity = 1) {
    toast?.showToast?.(`${product.name || 'Product'} added to cart`, 'success');
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          quantity,
        },
      ];
    });
  }

  function increase(productId) {
    setItems((current) => current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item));
  }

  function decrease(productId) {
    setItems((current) => current
      .map((item) => item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item)
      .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(productId) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const enrichedItems = useMemo(() => items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return {
      ...product,
      quantity: item.quantity,
      lineTotal: (product?.price || 0) * item.quantity,
    };
  }).filter(Boolean), [items]);

  const count = useMemo(() => enrichedItems.reduce((sum, item) => sum + item.quantity, 0), [enrichedItems]);
  const subtotal = useMemo(() => enrichedItems.reduce((sum, item) => sum + item.lineTotal, 0), [enrichedItems]);

  return (
    <CartContext.Provider value={{ items: enrichedItems, count, subtotal, addToCart, increase, decrease, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
