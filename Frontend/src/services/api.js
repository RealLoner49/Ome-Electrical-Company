const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function createOrder(payload, idToken) {
  return request('/orders', {
    method: 'POST',
    headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    body: JSON.stringify(payload),
  });
}

export async function notifyAdminOrder(payload) {
  return request('/orders/notify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function initializePayment(payload, idToken) {
  return request('/payments/paystack/initialize', {
    method: 'POST',
    headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    body: JSON.stringify(payload),
  });
}
