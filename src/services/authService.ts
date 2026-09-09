export const OTP_LENGTH = 6;

const extractMessage = (resData: any, defaultMsg: string) => {
  if (typeof resData?.message === "string") return resData.message;
  if (typeof resData?.message?.message === "string") return resData.message.message;
  if (typeof resData?.error === "string") return resData.error;
  return defaultMsg;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const checkPhone = async (phone: string): Promise<{ success: boolean; hasAccount?: boolean; message?: string; sessionId?: string }> => {
  try {
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
    const response = await fetch(`${API_BASE_URL}/customer-auth/check-phone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formattedPhone }),
    });
    const resData = await response.json();
    if (!response.ok) return { success: false, message: extractMessage(resData, "Failed to check phone") };
    return { 
      success: true, 
      hasAccount: resData.hasAccount, 
      message: extractMessage(resData, "Success"), 
      sessionId: resData.sessionId 
    };
  } catch (error) {
    return { success: false, message: "Network error. Try again later." };
  }
};

export const sendRegOtp = async (data: { name: string; email: string; phone: string }): Promise<{ success: boolean; message?: string; sessionId?: string }> => {
  try {
    const formattedPhone = data.phone.startsWith("+91") ? data.phone : `+91${data.phone}`;
    const response = await fetch(`${API_BASE_URL}/customer-auth/register/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, phone: formattedPhone }),
    });
    const resData = await response.json();
    if (!response.ok) return { success: false, message: extractMessage(resData, "Failed to send OTP") };
    return { success: true, message: extractMessage(resData, "OTP sent successfully"), sessionId: resData.sessionId };
  } catch (error) {
    return { success: false, message: "Network error. Try again later." };
  }
};

export const verifyLoginOtp = async (
  phone: string,
  otp: string,
  sessionId: string
): Promise<{ success: boolean; user?: { token: string; role: string; name: string; phone: string }; message?: string }> => {
  try {
    if (otp.length !== OTP_LENGTH) {
      return { success: false, message: `Enter the ${OTP_LENGTH}-digit OTP` };
    }
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
    const response = await fetch(`${API_BASE_URL}/customer-auth/login/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formattedPhone, otp, sessionId }),
    });
    const resData = await response.json();
    if (!response.ok) return { success: false, message: extractMessage(resData, "Invalid OTP") };
    
    return {
      success: true,
      user: {
        token: resData.accessToken,
        role: "USER", // Hardcoded since customer profile payload does not return role directly outside JWT
        name: resData.profile?.name,
        phone: resData.profile?.phone || phone,
      },
    };
  } catch (error) {
    return { success: false, message: "Verification failed. Try again." };
  }
};

export const verifyRegOtp = async (
  data: { phone: string; name: string; email: string },
  otp: string,
  sessionId: string
): Promise<{ success: boolean; user?: { token: string; role: string; name: string; phone: string }; message?: string }> => {
  try {
    if (otp.length !== OTP_LENGTH) {
      return { success: false, message: `Enter the ${OTP_LENGTH}-digit OTP` };
    }
    const formattedPhone = data.phone.startsWith("+91") ? data.phone : `+91${data.phone}`;
    const response = await fetch(`${API_BASE_URL}/customer-auth/register/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, phone: formattedPhone, otp, sessionId }),
    });
    const resData = await response.json();
    if (!response.ok) return { success: false, message: extractMessage(resData, "Invalid OTP") };
    
    return {
      success: true,
      user: {
        token: resData.accessToken,
        role: "USER",
        name: resData.profile?.name,
        phone: resData.profile?.phone || data.phone,
      },
    };
  } catch (error) {
    return { success: false, message: "Verification failed. Try again." };
  }
};
