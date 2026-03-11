'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { setOrders, setError } from '../store/ordersSlice';
import { getOrders } from '../services/ordersApi';
import { KanbanBoard } from '../components/KanbanBoard';
import { useOrderSimulation } from '../hooks/useOrderSimulation';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  useOrderSimulation();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const orders = await getOrders();
        if (active) dispatch(setOrders(orders));
      } catch (err: any) {
        if (active) dispatch(setError(err.message || 'Failed to sync with kitchen server'));
      }
    })();
    return () => {
      active = false;
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <KanbanBoard />
      </main>
    </div>
  );
}
