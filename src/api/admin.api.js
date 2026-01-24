import api from "../lib/axios";

export const fetchStats = async () => {
    const res = await api.get("/stats");
    return res.data;
};

export const registerCollege = async (formData) => {
    const res = await api.post("/colleges/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const registerSuperadmin = async (data) => {
    const res = await api.post("/superadmins", data); // Assuming this endpoint exists based on request
    return res.data;
};

export const fetchGlobalAnnouncements = async () => {
    const res = await api.get("/superadmins/announcements");
    return res.data;
};

export const createGlobalAnnouncement = async (data) => {
    const res = await api.post("/superadmins/announcements", data);
    return res.data;
};

export const deleteGlobalAnnouncement = async (announcementId) => {
    const res = await api.delete(`/superadmins/announcements/${announcementId}`);
    return res.data;
};

export const searchUserByEmail = async (email) => {
    const res = await api.get(`/superadmins/user/search`, { params: { email } });
    return res.data;
};
