import api from "../lib/axios";

export const updateUserProfile = async ({ collegeId, data }) => {
    const res = await api.patch(`/colleges/${collegeId}/me`, data);
    return res.data;
};
