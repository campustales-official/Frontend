import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeed } from "../api/feed.api";

export const useFeed = ({ scope, collegeId, clubId }) => {
  return useInfiniteQuery({
    queryKey: ["feed", { scope, collegeId, clubId, limit: 10 }],
    queryFn: fetchFeed,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 30_000,
  });
};
