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

function getServerSnapshot() {
  return null;
}

/**
 * Current time in milliseconds, updated every minute.
 * `null` on the server and during hydration, so time dependent output is only rendered on the client.
 */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
