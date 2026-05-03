import axios from 'axios';
import toast from 'react-hot-toast';

// In dev mode, we use Vite's proxy (/api -> backend) to avoid CORS issues
// In production, set VITE_API_BASE_URL to your backend URL (ensure CORS is configured)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================

export const authAPI = {
  signup: (name, email, password, role = 'user') =>
    api.post(`/signup?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`),

  verifyOTP: (email, otp) =>
    api.post(`/verify?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`),

  resendOTP: (email) =>
    api.post(`/resend-otp?email=${encodeURIComponent(email)}`),

  login: (email, password) =>
    api.post(`/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`),

  forgotPassword: (email) =>
    api.post(`/forgot-password?email=${encodeURIComponent(email)}`),

  resetPassword: (email, token, newPassword) =>
    api.post(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}&new_password=${encodeURIComponent(newPassword)}`),

  verifyToken: () =>
    api.get('/protected'),
};

// ==================== USER ENDPOINTS ====================

export const userAPI = {
  getEvents: () =>
    api.get('/Events'),

  registerForEvent: (eventId) =>
    api.post(`/register/${eventId}`),

  getProfile: () =>
    api.get('/me'),
};

// ==================== ADMIN ENDPOINTS ====================

export const adminAPI = {
  createEvent: (title, date, location) =>
    api.post(`/admin/create-event?title=${encodeURIComponent(title)}&date=${encodeURIComponent(date)}&location=${encodeURIComponent(location)}`),

  deleteEvent: (eventId) =>
    api.delete(`/admin/delete-event/${eventId}`),

  getUsers: () =>
    api.get('/admin/users'),

  getRegistrations: () =>
    api.get('/admin/registrations'),

  getRegistrationsByEvent: (eventId) =>
    api.get(`/admin/registrations/${eventId}`),

  getEventsByDate: (date) =>
    api.get(`/admin/events-by-date?date=${date}`),

  exportCSV: () =>
    api.get('/admin/export', { responseType: 'blob' }),

  markAttendance: (registrationId, attended) =>
    api.put(`/admin/mark-attendance/${registrationId}?attended=${attended}`),

  getAttendance: () =>
    api.get('/admin/attendance'),

  getAttendedUsers: () =>
    api.get('/admin/attended'),

  getEventStats: () =>
    api.get('/admin/event-stats'),
};

export default api;
