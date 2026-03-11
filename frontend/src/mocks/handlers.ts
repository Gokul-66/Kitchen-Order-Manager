import { http, HttpResponse } from 'msw';

type HistoryOrder = {
  id: number;
  customerName: string;
  total: number;
  completedAt: string;
};

function buildHistoryOrders(count = 50): HistoryOrder[] {
  const base = new Date('2026-03-10T06:00:00.000Z').getTime();
  const orders: HistoryOrder[] = [];

  for (let i = 0; i < count; i += 1) {
    const id = 5000 + i;
    const completedAt = new Date(base - i * 5 * 60 * 1000).toISOString();
    orders.push({
      id,
      customerName: `Guest ${i + 1}`,
      total: Number((12 + (i % 9) * 2.75).toFixed(2)),
      completedAt
    });
  }

  return orders;
}

export const handlers = [
  http.get('/api/history', () => {
    const data = buildHistoryOrders(60);
    return HttpResponse.json(data);
  })
];
