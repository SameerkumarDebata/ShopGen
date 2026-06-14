import API from './axios.js';

export const getProductsAPI = () => API.get('/products');
export const getProductByIdAPI = (id) => API.get(`/products/${id}`);
export const createProductAPI = (formData) =>
  API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProductAPI = (id, formData) =>
  API.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProductAPI = (id) => API.delete(`/products/${id}`);
export const createProductReviewAPI = (id, reviewData) => API.post(`/products/${id}/reviews`, reviewData);