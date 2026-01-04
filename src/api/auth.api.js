import api from "../lib/axios";

export const login = (data) =>
  api.post("/login", data);

export const signup = (data) =>
  api.post("/signup", data);

export const googleLogin = (idToken) =>
  api.post("/login/google", { idToken });
