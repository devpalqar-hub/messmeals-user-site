import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

interface MessFilters {
  search?: string;
  categoryId?: string;
  ratings?: string;
  is_active?: string;
  is_verified?: string;
  location?: string;
  variationId?: string;
  foodType?: string;
  districtName?: string;
  date1?: string;
  date2?: string;
}

export const getAllMess = async (
  page = 1,
  limit = 10,
  filters: MessFilters = {}
) => {
  // Build query params, only including non-empty values
  const params: any = { page, limit };

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== "") {
      params[key] = value;
    }
  });

  const res = await api.get("/mess", { params });
  return res.data;
};

export const getMessById = async (messId: string) => {
  const res = await api.get(`/mess/${messId}`);
  return res.data;
};

export const getPlanById = async (planId: string) => {
  const res = await api.get(`/plans/${planId}`);
  return res.data;
};