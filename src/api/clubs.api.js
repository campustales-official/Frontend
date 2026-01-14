import axios from "../lib/axios";

export const fetchClubs = async ({ collegeId }) => {
    const res = await axios.get(`/colleges/${collegeId}/clubs`);
    return res.data.data;
};

export const createClubPost = async ({ collegeId, clubId, content, files }) => {
    const formData = new FormData();
    formData.append("content", content);
    if (files && files.length > 0) {
        // Defensive: Limit to 5 files max to prevent Multer "Unexpected Field/File" errors
        files.slice(0, 5).forEach((file) => {
            formData.append("images", file);
        });
    }

    const res = await axios.post(`/colleges/${collegeId}/clubs/${clubId}/posts`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data.data;
};

export const createClubAnnouncement = async ({ collegeId, clubId, title, message, expiresAt }) => {
    // API Expectation: title, message, priority=info, expiresAt
    const res = await axios.post(`/colleges/${collegeId}/clubs/${clubId}/announcements`, {
        title,
        message,
        priority: "info",
        expiresAt
    });
    return res.data.data;
};

export const updateClubPost = async ({ collegeId, clubId, postId, content }) => {
    const res = await axios.patch(`/colleges/${collegeId}/clubs/${clubId}/posts/${postId}`, { content });
    return res.data;
};

export const deleteClubPost = async ({ collegeId, clubId, postId }) => {
    const res = await axios.delete(`/colleges/${collegeId}/clubs/${clubId}/posts/${postId}`);
    return res.data;
};

export const deleteClubAnnouncement = async ({ collegeId, clubId, announcementId }) => {
    const res = await axios.delete(`/colleges/${collegeId}/clubs/${clubId}/announcements/${announcementId}`);
    return res.data;
};
