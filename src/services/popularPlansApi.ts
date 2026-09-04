import axios from "axios";
import type { PopularPlan } from "../types/popularPlan";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ─── GET /open/popular-plans ──────────────────────────────────────────────────

export const getPopularPlans = async (
  page = 1,
  limit = 25
): Promise<{ data: PopularPlan[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
  const res = await api.get("/open/popular-plans", {
    params: { page, limit },
  });
  return res.data;
};
