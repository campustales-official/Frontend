import api from "../lib/axios";

export const searchColleges = async (q) => {
  const res = await api.get("/public/colleges", {
    params: { q, limit: 8 },
  });
  return res.data.items;
};
