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

// ─── New API types ─────────────────────────────────────────────────────────────

/** Schedule types accepted by POST /customer/choose/plan */
export type ScheduleType = "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";

/** Full-name weekday values accepted by the API */
export type ApiWeekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

/** Request body for POST /customer/choose/plan */
export interface ChoosePlanPayload {
  addressId: string;
  planId: string;
  start_date: string; // "YYYY-MM-DD"
  scheduleType: ScheduleType;
  end_date?: string; // "YYYY-MM-DD"
  selectedDays?: ApiWeekday[];
  successUrl?: string;
  cancelUrl?: string;
}

/** Subscription shape returned inside the response */
export interface SubscriptionResult {
  id: string;
  start_date: string;
  end_date: string | null;
  scheduleType: ScheduleType;
  selectedDays: ApiWeekday[];
  totalPrice: string;
  discount: string;
  discountedPrice: string;
  planId: string;
  messId: string;
  is_active: boolean;
  customerProfileId: string;
  userAddressId: string;
  createdAt: string;
}

/** Payment shape returned inside the response */
export interface PaymentResult {
  orderId: string;
  sessionUrl: string;
  amount: number;
  currency: string;
  paymentId: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
}

/** Full response from POST /customer/choose/plan */
export interface ChoosePlanResponse {
  message: string;
  data: {
    subscription: SubscriptionResult;
    payment: PaymentResult;
  };
}
