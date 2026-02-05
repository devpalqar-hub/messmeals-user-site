import axios from "axios";
import type { EnquiryPayload, EnquiryResponse } from "../types/enquiry";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const submitEnquiry = async (
  payload: EnquiryPayload
): Promise<EnquiryResponse> => {
  const res = await api.post("/contact-form/admin", payload);
  return res.data;
};
