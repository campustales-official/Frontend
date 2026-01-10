import api from "../lib/axios";

export const sendVerifyEmailOtp = (email) =>
  api.post("/verify-email/send", { email });

export const confirmVerifyEmailOtp = ({ email, otp }) =>
  api.post("/verify-email/confirm", { email, otp });
