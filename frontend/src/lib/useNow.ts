import { useSyncExternalStore } from 'react';

const MINUTE = 60_000;

function subscribe(onTick: () => void) {
  const interval = setInterval(onTick, MINUTE / 4);
  return () => clearInterval(interval);
}

// Rounded to the minute, so the snapshot only changes once per minute
function getSnapshot() {
  return Math.floor(Date.now() / MINUTE) * MINUTE;
}

/**
 * Current time in milliseconds, updated every minute.
 * On the server and during hydration it is `serverNow`, by default `null` so time dependent output is only rendered on the client.
 */
export function useNow(serverNow: number | null = null): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverNow);
}
