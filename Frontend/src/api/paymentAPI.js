import API from './axios.js';

export const createRazorpayOrderAPI = (data) => API.post('/payments/order', data);
export const verifyPaymentAPI = (data) => API.post('/payments/verify', data);