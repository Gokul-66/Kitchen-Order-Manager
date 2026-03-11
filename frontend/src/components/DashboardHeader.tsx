'use client';

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { addNewOrder, generateNewOrder, setError } from '../store/ordersSlice';
import { RestaurantToggle } from './RestaurantToggle';

export function DashboardHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const restaurantOpen = useSelector((state: RootState) => state.orders.restaurantOpen);

  const handleSimulate = () => {
    try {
      dispatch(addNewOrder(generateNewOrder()));
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to simulate order'));
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Bite Track - Kitchen Order Manager</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSimulate}
          disabled={!restaurantOpen}
          className="cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          CreateOrder
        </button>
        <RestaurantToggle />
      </div>
    </div>
  );
}
