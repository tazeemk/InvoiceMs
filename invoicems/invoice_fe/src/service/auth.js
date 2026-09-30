import { smClient } from "@/lib";

export async function signIn(payload) {
  const res = await smClient.post("/api/v1/auth/signin", payload);
  return res.data;
}

export async function signUp(payload) {
  await smClient.post("/api/v1/auth/signup", payload);
}

export const forgotPassword = async (email) => {
  const res = await smClient.post("/api/user/forgot-password", { email });
  return res.data;
};


export async function loginUser(credentials) {
  const response = await smClient.post(`/users/token`, credentials);
  return response.data;
}

export async function resetPassword(payload) {
  const response = await smClient.post(`/users/resetPassword`, payload);
  return response.data;
}

export async function sendOtp(payload) {
  const response = await smClient.post(`/users/send-otp`, payload);
  return response.data;
}
