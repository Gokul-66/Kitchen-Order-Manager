const API_BASE = 'http://localhost:5050/api/orders';

type OrderStatus = 'NEW' | 'PREPARING' | 'READY';

export async function getOrders() {
  const res = await fetch(API_BASE, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }
  return res.json();
}


export async function updateOrderStatus(id: string, status: OrderStatus) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || 'Failed to update order');
  }

  return res.json();
}
