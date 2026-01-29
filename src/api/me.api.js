import api from "../lib/axios";

export const fetchMe = async () => {
  const role = localStorage.getItem("roleInCollege");
  const endpoint = role === "external" ? "/external/me" : "/me";
  const res = await api.get(endpoint);
  return res.data;
};
