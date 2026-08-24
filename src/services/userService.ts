const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const getUserProfile = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch profile");
  }

  return data;
};
