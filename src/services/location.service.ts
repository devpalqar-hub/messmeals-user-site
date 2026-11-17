import axios from "axios";
import type { GeoLocationResponse } from "../types/location";

const locationApi = axios.create({
  baseURL: import.meta.env.VITE_LOCATION_API_BASE_URL,
});

export const searchLocations = async (query: string) => {
  if (!query || query.length < 2) return [];

  const res = await locationApi.get<GeoLocationResponse>(
    `/geolocation/zipcodes/search`,
    { params: { q: query } }
  );

  return res.data.data;
};
