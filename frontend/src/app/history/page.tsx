'use client';

import { useEffect, useMemo, useState } from 'react';

type HistoryOrder = {
  id: string | number;
  customerName: string;
  total: number;
  completedAt: string;
};

const PAGE_SIZE = 10;

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/history', { cache: 'no-store' });
        const data = await res.json();
        if (active) setOrders(Array.isArray(data) ? data : []);
      } catch {
        if (active) setOrders([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const visibleOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [currentPage, orders]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">Order History</h1>
        </header>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="max-h-[65vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Order ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold">Total</th>
                  <th className="px-4 py-3 text-left font-semibold">Completed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading
                  ? Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="h-3 w-16 rounded bg-slate-200" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-3 w-28 rounded bg-slate-200" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-3 w-14 rounded bg-slate-200" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-3 w-24 rounded bg-slate-200" />
                        </td>
                      </tr>
                    ))
                  : visibleOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 font-medium text-slate-900">#{order.id}</td>
                        <td className="px-4 py-3 text-slate-700">{order.customerName}</td>
                        <td className="px-4 py-3 text-slate-700">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(order.completedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {!loading && orders.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-slate-500">No history yet.</div>
            )}
          </div>
        </div>

        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
