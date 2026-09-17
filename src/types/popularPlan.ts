// ─── Popular Plan types: GET /open/popular-plans ──────────────────────────────

export type PopularPlanImage = {
  id: string;
  url: string;
  altText: string | null;
};

export type PopularPlanVariation = {
  id: string;
  title: string;
  description: string | null;
};

export type PopularPlanMess = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  address: string;
  location: string;
  coverImage: string | null;
};

/** Shape returned by GET /open/popular-plans (list item) */
export type PopularPlan = {
  id: string;
  planName: string;
  description: string;
  price: string;
  minPrice: string;
  isMonthlyPlan: boolean;
  isDailyPlan: boolean;
  totalCustomers: number;
  images: PopularPlanImage[];
  variations: PopularPlanVariation[];
  mess: PopularPlanMess;
};
