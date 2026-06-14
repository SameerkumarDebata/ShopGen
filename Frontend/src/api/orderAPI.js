import API from './axios.js';

export const createOrderAPI = (data) => API.post('/orders', data);
export const getMyOrdersAPI = () => API.get('/orders/myorders');
export const getAllOrdersAPI = () => API.get('/orders');
export const updateOrderStatusAPI = (id, status) => API.put(`/orders/${id}/status`, { status });