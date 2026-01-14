import axios from "../lib/axios";

/**
 * pageParam = cursor
 * queryKey = ["feed", { scope, collegeId, clubId, limit }]
 */
export const fetchFeed = async ({ pageParam = null, queryKey }) => {
  const [_key, { scope, collegeId, clubId, limit, types, eventStatus }] = queryKey;

  const params = { limit };
  if (clubId) params.clubId = clubId;
  if (pageParam) params.cursor = pageParam;
  if (types) params.types = types;
  if (eventStatus) params.eventStatus = eventStatus;

  console.log(scope)

  // Map scope to visibility param if not global
  if (scope) {
    params.visibility = scope;
  }

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
