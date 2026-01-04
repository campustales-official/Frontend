import { useQuery } from "@tanstack/react-query";
import { searchColleges } from "../api/colleges.api";

export const useCollegeSearch = (query) => {
  return useQuery({
    queryKey: ["colleges", query],
    queryFn: () => searchColleges(query),
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
};
