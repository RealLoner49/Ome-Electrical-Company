import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const OrderContext = createContext(null);
const STORAGE_KEY = 'ome-orders';

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(readOrders);

  useEffect(() => {
    const syncOrders = (event) => {
      if (event.key === STORAGE_KEY) setOrders(readOrders());
    };

    addEventListener('storage', syncOrders);
    return () => removeEventListener('storage', syncOrders);
  }, []);

  const persistOrders = (nextOrders) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
    return nextOrders;
  };

  const addOrder = (order) => {
    const orderId = order.id || order.ref;
    let saved;

    setOrders((current) => {
      const existing = current.find((entry) => entry.id === orderId);
      saved = {
        ...existing,
        id: orderId,
        status: order.status || existing?.status || 'pending',
        createdAt: existing?.createdAt || new Date().toISOString(),
        adminDeleted: false,
        customerDeleted: false,
        ...order,
      };

      return persistOrders([saved, ...current.filter((entry) => entry.id !== saved.id)]);
    });

    return saved;
  };

  const updateOrderStatus = (id, status) => {
    setOrders((current) => persistOrders(current.map((order) => (order.id === id ? { ...order, status } : order))));
  };

  const addFeedback = (id, feedback) => {
    setOrders((current) => persistOrders(current.map((order) => (
      order.id === id
        ? { ...order, feedback: { ...feedback, createdAt: new Date().toISOString() } }
        : order
    ))));
  };

  const hideOrderForAdmin = (id) => {
    setOrders((current) => persistOrders(current.map((order) => (
      order.id === id ? { ...order, adminDeleted: true } : order
    ))));
  };

  const deleteOrderForCustomer = (id) => {
    setOrders((current) => persistOrders(current.map((order) => (
      order.id === id ? { ...order, customerDeleted: true } : order
    ))));
  };

  const clearOrders = () => {
    setOrders((current) => persistOrders(current.map((order) => ({ ...order, adminDeleted: true }))));
  };

  const value = useMemo(
    () => ({ orders, addOrder, updateOrderStatus, addFeedback, hideOrderForAdmin, deleteOrderForCustomer, clearOrders }),
    [orders]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  return useContext(OrderContext);
}
