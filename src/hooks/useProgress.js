import { useCallback, useSyncExternalStore } from "react";

// localStorage-backed per-topic progress. Key kept from the original app
// (ib_oral_prog_v4) so existing users keep their saved state.
const KEY = "ib_oral_prog_v4";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

// Tiny pub/sub so every mounted component re-renders when progress changes.
const listeners = new Set();
const subscribe = (cb) => {
  listeners.add(cb);
  const onStorage = (e) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};

let cache = read();
let cacheRaw = JSON.stringify(cache);
const getSnapshot = () => {
  // useSyncExternalStore needs a stable reference unless data actually changed.
  const raw = localStorage.getItem(KEY) || "{}";
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    cache = read();
  }
  return cache;
};

export function useProgress() {
  const map = useSyncExternalStore(subscribe, getSnapshot, () => ({}));

  const get = useCallback((topic) => map[topic] || "none", [map]);

  const set = useCallback((topic, state) => {
    const next = { ...read(), [topic]: state };
    localStorage.setItem(KEY, JSON.stringify(next));
    cacheRaw = JSON.stringify(next);
    cache = next;
    listeners.forEach((cb) => cb());
  }, []);

  return { get, set, map };
}
