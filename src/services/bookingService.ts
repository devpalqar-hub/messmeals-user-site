import type { BookingDraft, Subscription } from "../types/booking";

/**
 * MOCK booking service — persists to localStorage so the booking + profile
 * (pause / cancel) flows can be exercised end-to-end in the UI.
 * TODO: swap every function body below for a real API call once the
 * backend endpoints are available. Signatures are designed to map 1:1
 * onto typical REST endpoints (POST /subscriptions, PATCH .../pause, etc.)
 */

const STORAGE_KEY = "mm_subscriptions";

const readAll = (): Subscription[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Subscription[]) : [];
  } catch {
    return [];
  }
};

const writeAll = (subs: Subscription[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
};

export const createBooking = async (
  draft: BookingDraft
): Promise<Subscription> => {
  // TODO: POST /subscriptions
  await new Promise((r) => setTimeout(r, 600));

  const sub: Subscription = {
    ...draft,
    id: `sub_${Date.now()}`,
    status: "active",
    createdAt: new Date().toISOString(),
    pausedRanges: [],
    skippedDates: [],
  };

  const all = readAll();
  all.unshift(sub);
  writeAll(all);

  return sub;
};

export const getSubscriptions = async (
  phone: string
): Promise<Subscription[]> => {
  // TODO: GET /subscriptions?phone=...
  await new Promise((r) => setTimeout(r, 300));
  return readAll().filter((s) => s.contactPhone === phone);
};

export const pauseSubscription = async (
  id: string,
  range: { start: string; end: string }
): Promise<Subscription | undefined> => {
  // TODO: POST /subscriptions/:id/pause
  await new Promise((r) => setTimeout(r, 400));

  const all = readAll();
  const sub = all.find((s) => s.id === id);
  if (!sub) return undefined;

  sub.pausedRanges.push({ id: `pause_${Date.now()}`, ...range });
  sub.status = "paused";
  writeAll(all);
  return sub;
};

export const cancelSubscription = async (
  id: string
): Promise<Subscription | undefined> => {
  // TODO: POST /subscriptions/:id/cancel
  await new Promise((r) => setTimeout(r, 400));

  const all = readAll();
  const sub = all.find((s) => s.id === id);
  if (!sub) return undefined;

  sub.status = "cancelled";
  writeAll(all);
  return sub;
};

export const skipMeal = async (
  id: string,
  date: string
): Promise<Subscription | undefined> => {
  // TODO: POST /subscriptions/:id/skip-day
  await new Promise((r) => setTimeout(r, 400));

  const all = readAll();
  const sub = all.find((s) => s.id === id);
  if (!sub) return undefined;

  if (!sub.skippedDates.includes(date)) sub.skippedDates.push(date);
  writeAll(all);
  return sub;
};
