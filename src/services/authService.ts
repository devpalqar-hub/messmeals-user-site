/**
 * MOCK auth service — UI/flow only for now.
 * TODO: replace the bodies of sendOtp/verifyOtp with real API calls once
 * the backend endpoints are available. Keep the function signatures the
 * same so nothing else needs to change.
 */

export type AuthUser = {
  phone: string;
  name: string;
};

const OTP_LENGTH = 4;
const MOCK_OTP = "1234"; // any OTP works in dev; kept for local testing hint

export const sendOtp = async (phone: string): Promise<{ success: boolean }> => {
  // TODO: POST /auth/send-otp { phone }
  await new Promise((r) => setTimeout(r, 700));
  console.info(`[mock] OTP sent to ${phone}. Use ${MOCK_OTP} to verify.`);
  return { success: true };
};

export const verifyOtp = async (
  phone: string,
  otp: string
): Promise<{ success: boolean; user?: AuthUser; message?: string }> => {
  // TODO: POST /auth/verify-otp { phone, otp }
  await new Promise((r) => setTimeout(r, 700));

  if (otp.length !== OTP_LENGTH) {
    return { success: false, message: `Enter the ${OTP_LENGTH}-digit OTP` };
  }

  return {
    success: true,
    user: { phone, name: "" },
  };
};

export { OTP_LENGTH };
