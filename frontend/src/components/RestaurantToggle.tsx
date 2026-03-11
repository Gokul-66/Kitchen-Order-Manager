'use client';

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { toggleRestaurant } from '../store/ordersSlice';

export function RestaurantToggle() {
  const dispatch = useDispatch<AppDispatch>();
  const restaurantOpen = useSelector((state: RootState) => state.orders.restaurantOpen);

  const handleClick = () => {
    dispatch(toggleRestaurant());
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        restaurantOpen
          ? 'cursor-pointer rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700'
          : 'cursor-pointer rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700'
      }
    >
      {restaurantOpen ? 'Restaurant Open' : 'Restaurant Closed'}
    </button>
  );
}
