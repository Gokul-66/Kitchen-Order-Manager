'use client';

import { useEffect, useState } from 'react';

// Shared state outside the hook to ensure all subscribers are perfectly synced
let globalTick = 0;
let subscribers: Array<(tick: number) => void> = [];
let intervalId: NodeJS.Timeout | null = null;

function startInterval() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    globalTick += 1;
    subscribers.forEach((cb) => cb(globalTick));
  }, 60000); // Once per minute
}

function stopInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function useGlobalTicker() {
  const [tick, setTick] = useState(globalTick);

  useEffect(() => {
    subscribers.push(setTick);
    if (subscribers.length === 1) {
      startInterval();
    }

    return () => {
      subscribers = subscribers.filter((cb) => cb !== setTick);
      if (subscribers.length === 0) {
        stopInterval();
      }
    };
  }, []);

  return tick;
}
