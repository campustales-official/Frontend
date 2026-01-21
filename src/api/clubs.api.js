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

export const joinClub = async ({ collegeId, clubId }) => {
    const res = await axios.post(`/colleges/${collegeId}/clubs/${clubId}/join`);
    return res.data;
};

export const leaveClub = async ({ clubId }) => {
    const res = await axios.delete(`/clubs/${clubId}/leave`);
    return res.data;
};

export const fetchClubMembers = async ({ clubId }) => {
    const res = await axios.get(`/clubs/${clubId}/members`);
    return res.data.data;
};

export const updateClubMember = async ({ collegeId, clubId, userId, roleInClub, positions }) => {
    const res = await axios.patch(`/colleges/${collegeId}/clubs/${clubId}/members/${userId}`, { roleInClub, positions });
    return res.data;
};

export const updateClubDetails = async ({ collegeId, clubId, data }) => {
    // data should be FormData if images are included
    const res = await axios.patch(`/colleges/${collegeId}/clubs/${clubId}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};

export const removeClubMember = async ({ collegeId, clubId, userId }) => {
    const res = await axios.delete(`/colleges/${collegeId}/clubs/${clubId}/members/${userId}`);
    return res.data;
};

export const registerClub = async ({ collegeId, data }) => {
    const res = await axios.post(`/colleges/${collegeId}/clubs`, data);
    return res.data.data;
};
