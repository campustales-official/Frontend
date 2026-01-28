export const formatSafeDate = (dateString, options = {}) => {
    if (!dateString) return "To be announced";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "To be announced";
    return date.toLocaleString([], options);
};

export const formatSafeDateOnly = (dateString, options = { month: 'short', day: 'numeric', year: 'numeric' }) => {
    if (!dateString) return "To be announced";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "To be announced";
    return date.toLocaleDateString([], options);
};
