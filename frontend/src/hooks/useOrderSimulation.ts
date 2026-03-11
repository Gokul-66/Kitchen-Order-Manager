'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { addNewOrder, generateNewOrder } from '../store/ordersSlice';

export function useOrderSimulation() {
  const dispatch = useDispatch<AppDispatch>();
  const restaurantOpen = useSelector((state: RootState) => state.orders.restaurantOpen);
  const newOrdersCount = useSelector((state: RootState) =>
    state.orders.orders.filter((o) => o.status === 'NEW').length
  );

  useEffect(() => {
    if (!restaurantOpen) return;

    const intervalId = setInterval(() => {
      if (newOrdersCount < 50) {
        dispatch(addNewOrder(generateNewOrder()));
      }
    }, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, restaurantOpen, newOrdersCount]);
}
