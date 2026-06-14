import API from './axios.js';

export const getAdminStatsAPI = () => API.get('/analytics');