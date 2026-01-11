import axios from "../lib/axios";

export const likePost = async (postId) => {
  await axios.post(`/posts/${postId}/like`);
};
