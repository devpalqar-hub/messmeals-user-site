export type PlanType = "monthly" | "daily";

export const WEEKDAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export type DeliveryAddress = {
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  landmark?: string;
};

export type BookingDraft = {
  messId: string;
  messName: string;
  planId: string;
  planName: string;
  price: string;
  planType: PlanType;

  // Monthly plan fields
  startDate?: string;
  months?: number;

  // Daily plan fields
  endDate?: string;
  weekdays?: Weekday[];
  extraDates?: string[];

  address: DeliveryAddress;
  contactName: string;
  contactPhone: string;
};

export type PausedRange = {
  id: string;
  start: string;
  end: string;
};

export type Subscription = BookingDraft & {
  id: string;
  status: "active" | "paused" | "cancelled";
  createdAt: string;
  pausedRanges: PausedRange[];
  skippedDates: string[];
};
