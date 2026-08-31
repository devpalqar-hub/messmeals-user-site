import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ─── Filters for GET /open/messes ─────────────────────────────────────────────

export interface MessListFilters {
  search?: string;
  foodType?: string;   // VEG | NON_VEG | MIXED
  planType?: string;   // DAILY | MONTHLY
  featured?: string;   // "true" | "false"
  isVerified?: string; // "true" | "false"
}

// ─── GET /open/messes ─────────────────────────────────────────────────────────

export const getAllMess = async (
  page = 1,
  limit = 10,
  filters: MessListFilters = {}
) => {
  const params: Record<string, string | number> = { page, limit };

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== "") {
      params[key] = value;
    }
  });

  const res = await api.get("/open/messes", { params });
  return res.data;
};

// ─── GET /open/mess/{slug} ────────────────────────────────────────────────────

export const getMessBySlug = async (slug: string) => {
  const res = await api.get(`/open/mess/${slug}`);
  return res.data;
};

// ─── GET /plans/:id — unchanged, used by BookPlan ────────────────────────────

export const getPlanById = async (planId: string) => {
  const res = await api.get(`/plans/${planId}`);
  return res.data;
};