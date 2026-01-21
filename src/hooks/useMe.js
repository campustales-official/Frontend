import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../api/me.api";

export const useMe = () => {

  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 10 * 60 * 1000,   // user data rarely changes
    retry: false,               // 401 should not retry
  });
};
