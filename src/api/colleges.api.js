import api from "../lib/axios";

export const searchColleges = async (q) => {
  const res = await api.get("/public/colleges", {
    params: { q, limit: 8 },
  });
  return res.data.items;
};

export const createCollegePost = async ({ collegeId, content, files, visibility }) => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("visibility", visibility || "college");
  if (files && files.length > 0) {
    files.slice(0, 5).forEach((file) => {
      formData.append("images", file);
    });
  }

  const res = await api.post(`/colleges/${collegeId}/posts`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
};

export const createCollegeAnnouncement = async ({ collegeId, title, message, expiresAt }) => {
  const res = await api.post(`/colleges/${collegeId}/announcements`, {
    title,
    message,
    priority: "info",
    expiresAt
  });
  return res.data.data;
};

export const deleteCollegePost = async ({ collegeId, postId }) => {
  const res = await api.delete(`/colleges/${collegeId}/posts/${postId}`);
  return res.data;
};

export const deleteCollegeAnnouncement = async ({ collegeId, announcementId }) => {
  const res = await api.delete(`/colleges/${collegeId}/announcements/${announcementId}`);
  return res.data;
};

export const fetchCollege = async (collegeId) => {
  const res = await api.get(`/colleges/${collegeId}`);
  return res.data.data;
};
