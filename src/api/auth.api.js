import api from "../lib/axios";

export const login = (data) =>
  api.post("/login", data);

export const signup = (data) =>
  api.post("/signup", data);

export const googleLogin = (idToken) =>
  api.post("/login/google", { idToken });

export const requestForgotPasswordOtp = (email) =>
  api.post("/auth/forgot-password", { email });

export const verifyForgotPasswordOtp = (email, otp) =>
  api.post("/auth/forgot-password/verify-otp", { email, otp });

export const resetPassword = (email, resetToken, newPassword) =>
  api.post("/auth/forgot-password/reset", { email, resetToken, newPassword });

export const logout = () =>
  api.post("/logout");

export const changePassword = (data) =>
  api.post("/change-password", data);

export const changeEmail = (data) =>
  api.post("/change-email", data);
