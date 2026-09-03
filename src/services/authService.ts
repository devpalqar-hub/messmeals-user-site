export const OTP_LENGTH = 6;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const sendRegOtp = async (data: { name: string; email: string; phone: string }): Promise<{ success: boolean; message?: string; sessionId?: string }> => {
  try {
    const formattedPhone = data.phone.startsWith("+91") ? data.phone : `+91${data.phone}`;
    const response = await fetch(`${API_BASE_URL}/auth/send-reg-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, phone: formattedPhone }),
    });
    const resData = await response.json();
    if (!response.ok) return { success: false, message: resData.message || "Failed to send OTP" };
    return { success: true, message: resData.message, sessionId: resData.sessionId };
  } catch (error) {
    return { success: false, message: "Network error. Try again later." };
  }
};

export const sendLoginOtp = async (phone: string): Promise<{ success: boolean; message?: string; sessionId?: string }> => {
  try {
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
    const response = await fetch(`${API_BASE_URL}/auth/send-login-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formattedPhone }),
    });
    const resData = await response.json();
    if (!response.ok) return { success: false, message: resData.message || "Failed to send OTP" };
    return { success: true, message: resData.message, sessionId: resData.sessionId };
  } catch (error) {
    return { success: false, message: "Network error. Try again later." };
  }
};

export const verifyOtp = async (
  phone: string,
  otp: string,
  sessionId: string
): Promise<{ success: boolean; user?: { token: string; role: string; name: string; phone: string }; message?: string }> => {
  try {
    if (otp.length !== OTP_LENGTH) {
      return { success: false, message: `Enter the ${OTP_LENGTH}-digit OTP` };
    }
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formattedPhone, otp, sessionId }),
    });
    const resData = await response.json();
    if (!response.ok) return { success: false, message: resData.message || "Invalid OTP" };
    
    return {
      success: true,
      user: {
        token: resData.accessToken,
        role: resData.user.role,
        name: resData.user.name,
        phone: resData.user.phone || phone,
      },
    };
  } catch (error) {
    return { success: false, message: "Verification failed. Try again." };
  }
};
