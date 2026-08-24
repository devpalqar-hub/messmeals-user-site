import type { Address, AddressPayload } from "../types/address";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const getAddresses = async (token: string): Promise<Address[]> => {
  const response = await fetch(`${API_BASE_URL}/address`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Failed to fetch addresses");
  }

  return resData.data || [];
};

export const createAddress = async (token: string, payload: AddressPayload): Promise<Address> => {
  const response = await fetch(`${API_BASE_URL}/address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Failed to create address");
  }

  return resData.data;
};
