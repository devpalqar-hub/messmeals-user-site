export type MessImage = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

export type PlanVariation = {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
};

export type MessPlan = {
  id: string;
  planName: string;
  price: string;
  minPrice?: string;
  description?: string;
  isMonthlyPlan?: boolean;
  isDailyPlan?: boolean;
  isActive?: boolean;
  images?: MessImage[];
  Variation?: PlanVariation[];
};

export type MessFoodType = {
  id: string;
  messId: string;
  foodType: "VEG" | "NON_VEG" | "MIXED" | string;
};

export type MessTag = {
  id: string;
  messId: string;
  tag: string;
};

export type Mess = {
  id: string;
  name: string;
  description: string;
  ratings?: number;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  location: string | null;
  plans: MessPlan[];
  images?: MessImage[];
  Testimonials?: MessTestimonial[];
};

export type MessMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Extended type for single mess details page
export type MessAdmin = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    is_active: boolean;
  };
};

export type MessTestimonial = {
  id: string;
  rating: number;
  comment: string;
  customerName: string;
  createdAt: string;
};

export type MessDetails = {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  openingHours: Record<string, string>; // { "Monday": "9:30-16:00", ... }
  location: string | null;
  createdAt: string;
  updatedAt: string;
  plans: MessPlan[];
  messAdmins: MessAdmin[];
  Testimonials: MessTestimonial[];
  DeliveryPartnerProfile: any[];
  UserSubscriptions: any[];
  images: MessImage[];
  foodTypes?: MessFoodType[];
  tags?: MessTag[];
};