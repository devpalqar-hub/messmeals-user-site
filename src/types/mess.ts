// ─── Shared ───────────────────────────────────────────────────────────────────

export type MessImage = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

export type MessMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// ─── List API: GET /open/messes ───────────────────────────────────────────────

export type MessListingAddress = {
  address: string;
  location: string;
  zipcode: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type MessListingStatus = {
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
};

/** Shape returned by GET /open/messes (list item) */
export type MessListing = {
  id: string;
  slug: string;
  messName: string;
  logo: string | null;
  coverImage: string | null;
  startingPlanPrice: number | null;
  address: MessListingAddress;
  status: MessListingStatus;
  distanceKm: number | null;
  foodTypes: string[];
};

// ─── Detail API: GET /open/mess/{slug} ────────────────────────────────────────

export type MessDetailAddress = {
  address: string;
  location: string;
  zipcode: string | null;
  latitude: number | null;
  longitude: number | null;
  district: string | null;
};

export type MessDetailStatus = {
  isVerified: boolean;
  isFeatured: boolean;
  isPremium: boolean;
};

/** A single meal item entry inside a day's schedule */
export type PlanMenuEntry = {
  items: string;
  variationId: string;
};

/** Weekly schedule: day name (uppercased) → list of meal entries */
export type PlanMenuSchedule = Record<string, PlanMenuEntry[]>;

/** A named menu (e.g. "Basic Veg Plan") with its weekly schedule */
export type PlanMenu = {
  id: string;
  name: string;
  schedule: PlanMenuSchedule;
};

export type PlanVariation = {
  id: string;
  title: string;
  description: string | null;
};

/** Plan returned inside GET /open/mess/{slug} */
export type NewMessPlan = {
  id: string;
  planName: string;
  description: string;
  price: string;
  minPrice: string;
  isMonthlyPlan: boolean;
  isDailyPlan: boolean;
  images: MessImage[];
  variations: PlanVariation[];
  menus: PlanMenu[];
};

/** Full mess detail returned by GET /open/mess/{slug} */
export type MessDetails = {
  id: string;
  slug: string;
  messName: string;
  description: string;
  logo: string | null;
  coverImage: string | null;
  gallery: MessImage[];
  address: MessDetailAddress;
  phone: string;
  email: string;
  openingHours: Record<string, string>;
  features: string[];
  status: MessDetailStatus;
  foodTypes: string[];
  tags: string[];
  plans: NewMessPlan[];
};

// ─── Legacy types (kept for BookPlan page — GET /plans/:id unchanged) ─────────

/** @deprecated Use MessListing instead */
export type Mess = MessListing;

/** Full plan detail returned by GET /plans/:id (used by BookPlan) */
export type PlanDetail = {
  id: string;
  planName: string;
  price: string;
  minPrice?: string;
  description?: string;
  messId: string;
  isMonthlyPlan: boolean;
  isDailyPlan: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: MessImage[];
  mess: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  Variation: PlanVariation[];
};