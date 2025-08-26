const BASE = import.meta.env.VITE_API_URL;

async function call(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error');
  }
  return res.json();
}

export const api = {
  orders: {
    listByRole: ({ role, opticName, labName, customerName }) => {
      const p = new URLSearchParams();
      if (role) p.set('role', role);
      if (opticName) p.set('opticName', opticName);
      if (labName) p.set('labName', labName);
      if (customerName) p.set('customerName', customerName);
      return call(`/orders?${p.toString()}`);
    },
    create: (payload) =>
      call('/orders', { method: 'POST', body: JSON.stringify(payload) }),
    setStatus: (id, toStatus, note) =>
      call(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ toStatus, note }),
      }),
  },
};

export function setAuth(a) {
  localStorage.setItem('auth', JSON.stringify(a));
}
export function getAuth() {
  try { return JSON.parse(localStorage.getItem('auth') || '{}'); }
  catch { return {}; }
}
