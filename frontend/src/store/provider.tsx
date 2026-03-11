'use client';

import { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store, type AppDispatch } from './store';
import { setRestaurantStatus } from './ordersSlice';

type ReduxProviderProps = {
  children: React.ReactNode;
};

function StoreInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const savedStatus = localStorage.getItem('restaurantOpen');
    if (savedStatus !== null) {
      dispatch(setRestaurantStatus(savedStatus === 'true'));
    }
  }, [dispatch]);

  return <>{children}</>;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <StoreInitializer>{children}</StoreInitializer>
    </Provider>
  );
}

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      if (process.env.NODE_ENV === 'development') {
        const { worker } = await import('../mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
      }
      setReady(true);
    }

    init();
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
