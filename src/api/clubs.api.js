import axios from "../lib/axios";

export const fetchClubs = async ({ collegeId }) => {
    const res = await axios.get(`/colleges/${collegeId}/clubs`);
    return res.data.data;
};
