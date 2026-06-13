import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const loginUser = (data) => API.post('/api/auth/login', data);
export const registerUser = (data) => API.post('/api/auth/register', data);
export const getMe = () => API.get('/api/auth/me');
export const updateProfile = (data) => API.put('/api/auth/profile', data);

// Donations
export const getDonations = (params) => API.get('/api/donations', { params });
export const getMyDonations = () => API.get('/api/donations/my');
export const getDonationById = (id) => API.get(`/api/donations/${id}`);
export const createDonation = (data) => API.post('/api/donations', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateDonation = (id, data) => API.put(`/api/donations/${id}`, data);
export const deleteDonation = (id) => API.delete(`/api/donations/${id}`);
export const getAllDonationsAdmin = () => API.get('/api/donations/admin/all');

// Requests
export const createRequest = (data) => API.post('/api/requests', data);
export const getMyRequests = () => API.get('/api/requests/my');
export const getDonorRequests = () => API.get('/api/requests/donor');
export const approveRequest = (id) => API.put(`/api/requests/${id}/approve`);
export const rejectRequest = (id) => API.put(`/api/requests/${id}/reject`);
export const getAllRequestsAdmin = () => API.get('/api/requests/admin/all');

// Deliveries
export const getPendingDeliveries = () => API.get('/api/deliveries/pending');
export const getMyDeliveries = () => API.get('/api/deliveries/my');
export const acceptDelivery = (id) => API.put(`/api/deliveries/${id}/accept`);
export const updateDeliveryStatus = (id, data) => API.put(`/api/deliveries/${id}/status`, data);
export const scanQR = (data) => API.post('/api/deliveries/scan-qr', data);

// Notifications
export const getNotifications = () => API.get('/api/notifications');
export const markNotifRead = (id) => API.put(`/api/notifications/${id}/read`);
export const markAllRead = () => API.put('/api/notifications/read-all');

// Reviews
export const createReview = (data) => API.post('/api/reviews', data);
export const getReviews = (userId) => API.get(`/api/reviews/${userId}`);

// Admin
export const getAdminDashboard = () => API.get('/api/admin/dashboard');
export const getAllUsers = () => API.get('/api/admin/users');
export const verifyUser = (id) => API.put(`/api/admin/users/${id}/verify`);
export const toggleUserStatus = (id) => API.put(`/api/admin/users/${id}/toggle`);
export const deleteUser = (id) => API.delete(`/api/admin/users/${id}`);
export const getAdminReports = () => API.get('/api/admin/reports');

// Dashboard
export const getPublicStats = () => API.get('/api/dashboard/stats');

export default API;
