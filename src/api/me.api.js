import api from "../lib/axios";

export const fetchMe = async () => {
  const res = await api.get("/me");
  return res.data;
};
