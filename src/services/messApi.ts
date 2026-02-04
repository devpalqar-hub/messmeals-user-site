import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getAllMess = async (page = 1, limit = 10) => {
  const res = await api.get("/mess", {
    params: { page, limit },
  });
  return res.data;
};

export const getMessById = async (messId: string) => {
  const res = await api.get(`/mess/${messId}`);
  return res.data;
};