'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { moveOrder, Order, setError } from '../store/ordersSlice';
import { updateOrderStatus } from '../services/ordersApi';
import { useGlobalTicker } from '../hooks/useGlobalTicker';

type OrderCardProps = {
  order: Order;
};


export function formatMinutesAgo(createdAt?: string) {
  if (!createdAt) return '';
  const created = new Date(createdAt).getTime();
  const now = Date.now();

  const diffMs = now - created;
  if (diffMs < 60000) return 'Just now';

  const diffMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ago`;
  }

  return `${minutes}m ago`;
}

export function OrderCard({ order }: OrderCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const tick = useGlobalTicker();
  const nextStatus = order.status === 'NEW' ? 'PREPARING' : order.status === 'PREPARING' ? 'READY' : null;

  const timeAgo = useMemo(() => formatMinutesAgo(order.createdAt), [order.createdAt, tick]);

  const handleUpdate = async () => {
    if (!nextStatus) return;
    setLoading(true);
    try {
      await updateOrderStatus(String(order.id), nextStatus);
      dispatch(moveOrder({ id: String(order.id), status: nextStatus }));
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to update order status'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <p className="text-sm font-semibold text-slate-900">{order.customerName}</p>
        {timeAgo && <span className="text-xs text-slate-500">{timeAgo}</span>}
      </div>
      <ul className="mb-3 list-disc space-y-1 pl-4 text-xs text-slate-600">
        {Object.entries(
          (order.items || []).reduce((acc: Record<string, number>, item) => {
            acc[item] = (acc[item] || 0) + 1;
            return acc;
          }, {})
        ).map(([item, count], index) => (
          <li key={`${item}-${index}`}>
            {count > 1 ? `${count}x ` : ''}
            {item}
          </li>
        ))}
      </ul>
      {nextStatus && (
        <button
          type="button"
          onClick={handleUpdate}
          disabled={loading}
          className="w-full cursor-pointer rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? 'Updating...'
            : order.status === 'NEW'
              ? 'Start Preparing'
              : 'Mark Ready'}
        </button>
      )}
    </article>
  );
}
