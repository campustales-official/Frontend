import axios from "../lib/axios";

/**
 * Helper to resolve the base path for events based on context (College or Club).
 */
const getBasePath = (collegeId, clubId) => {
    if (clubId) {
        return `/colleges/${collegeId}/clubs/${clubId}/events`;
    }
    return `/colleges/${collegeId}/events`;
};

export const createEvent = async ({ collegeId, clubId, formData }) => {
    // formData should be a FormData object containing banner and other fields
    const basePath = getBasePath(collegeId, clubId);
    const res = await axios.post(basePath, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    console.log("CREATE EVENT RESPONSE:", res.data); // Debug log
    return res.data.data;
};

export const updateEvent = async ({ collegeId, clubId, eventId, formData }) => {
    const basePath = getBasePath(collegeId, clubId);
    const res = await axios.patch(`${basePath}/${eventId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data.data;
};

export const getEventDetails = async (eventId) => {
    const res = await axios.get(`/events/${eventId}`);
    // Handle different response structures
    return res.data.data || res.data;
};

export const publishEvent = async ({ collegeId, clubId, eventId }) => {
    const basePath = getBasePath(collegeId, clubId);
    const res = await axios.post(`${basePath}/${eventId}/publish`);
    return res.data;
};

export const closeRegistration = async ({ collegeId, clubId, eventId }) => {
    const basePath = getBasePath(collegeId, clubId);
    console.log(basePath)
    const res = await axios.post(`${basePath}/${eventId}/close-registration`);
    return res.data;
};

export const completeEvent = async ({ collegeId, clubId, eventId }) => {
    const basePath = getBasePath(collegeId, clubId);
    const res = await axios.post(`${basePath}/${eventId}/complete`);
    return res.data;
};

export const deleteEvent = async ({ collegeId, clubId, eventId }) => {
    const basePath = getBasePath(collegeId, clubId);
    const res = await axios.delete(`${basePath}/${eventId}`);
    return res.data;
};

export const registerForEvent = async ({ collegeId, clubId, eventId, answers, visibility }) => {
    let url;
    if (collegeId && (visibility === 'college' || visibility === 'club')) {
        url = `/colleges/${collegeId}/events/${eventId}/register`;
    } else {
        url = `/events/${eventId}/register`;
    }

    const formData = new FormData();
    if (clubId) {
        formData.append("clubId", clubId);
    }

    if (answers && answers.length > 0) {
        answers.forEach((ans, index) => {
            formData.append(`answers[${index}][questionKey]`, ans.questionKey);
            // If it's a file, it will be appended as a file object
            formData.append(`answers[${index}][answer]`, ans.answer);
        });
    }

    const res = await axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
export const getEventRegistrations = async ({ collegeId, clubId, eventId, page = 1, limit = 10, search = "", status = "" }) => {
    const basePath = getBasePath(collegeId, clubId);
    const res = await axios.get(`${basePath}/${eventId}/registrations`, {
        params: { page, limit, search, status }
    });
    return res.data.data || res.data;
};

export const getRegistrationDetails = async ({ collegeId, clubId, eventId, registrationId }) => {
    // Student view (Self): Just use registrationId
    if (!eventId || !collegeId) {
        const res = await axios.get(`/registrations/${registrationId}`);
        return res.data.data || res.data;
    }

    // Admin view: Use full path
    const basePath = getBasePath(collegeId, clubId);
    const res = await axios.get(`${basePath}/${eventId}/registrations/${registrationId}`);
    return res.data.data || res.data;
};

export const updateRegistration = async (registrationId, data) => {
    const formData = new FormData();

    if (data.answers && data.answers.length > 0) {
        data.answers.forEach((ans, index) => {
            formData.append(`answers[${index}][questionKey]`, ans.questionKey);
            formData.append(`answers[${index}][answer]`, ans.answer);
        });
    }

    const res = await axios.patch(`/registrations/${registrationId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data.data || res.data;
};

export const cancelRegistration = async (registrationId) => {
    const res = await axios.post(`/registrations/${registrationId}/cancel`);
    return res.data.data || res.data;
};
