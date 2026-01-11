import axios from "../lib/axios";

/**
 * pageParam = cursor
 * queryKey = ["feed", { scope, collegeId, clubId, limit }]
 */
export const fetchFeed = async ({ pageParam = null, queryKey }) => {
  const [_key, { scope, collegeId, clubId, limit }] = queryKey;

  const params = { limit };
  if (clubId) params.clubId = clubId;
  if (pageParam) params.cursor = pageParam;

  let url;

  if (scope === "global") {
    url = "/feed/global";
  } else {
    // college OR club feed
    url = `/feed/${collegeId}`;
  }

  const res = await axios.get(url, { params });

  return res.data.data; // { items, nextCursor }
};
