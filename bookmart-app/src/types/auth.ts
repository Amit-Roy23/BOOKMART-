import { api } from "@/api/clients";
import { ENDPOINTS } from "@/api/endpoints";

export const registerUser = async (data: { full_name: string; email: string; password: string }) => {
  const response = await api.post(ENDPOINTS.AUTH.REGISTER, data);
  return response.data;
};

export const verifyRegisterOtp = async (data: { email: string; otp: string }) => {
  const response = await api.post(ENDPOINTS.AUTH.VERIFY_REGISTER_OTP, data);
  return response.data;
};

export const resendOtp = async (data: { email: string }) => {
  const response = await api.post(ENDPOINTS.AUTH.RESEND_OTP, data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post(ENDPOINTS.AUTH.LOGIN, data);
  return response.data;
};
