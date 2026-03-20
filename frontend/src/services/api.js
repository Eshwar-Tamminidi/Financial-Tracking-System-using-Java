import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (username, password) =>
    apiClient.post('/auth/login', { usernameOrEmail: username, password }),
  register: (data) =>
    apiClient.post('/auth/register', data),
  validateToken: (token) =>
    apiClient.get('/auth/validate', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// User APIs
export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  changePassword: (data) => apiClient.put('/users/change-password', data),
};

// Helper function to get userId from localStorage
const getUserId = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user).id;
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      return null;
    }
  }
  return null;
};

// Account APIs
export const accountAPI = {
  getAll: () => apiClient.get('/accounts', { params: { userId: getUserId() } }),
  getById: (id) => apiClient.get(`/accounts/${id}`, { params: { userId: getUserId() } }),
  create: (data) => apiClient.post('/accounts', data, { params: { userId: getUserId() } }),
  update: (id, data) => apiClient.put(`/accounts/${id}`, data, { params: { userId: getUserId() } }),
  delete: (id) => apiClient.delete(`/accounts/${id}`, { params: { userId: getUserId() } }),
  getBalance: (id) => apiClient.get(`/accounts/${id}/balance`, { params: { userId: getUserId() } }),
};

// Category APIs
export const categoryAPI = {
  getAll: () => apiClient.get('/categories', { params: { userId: getUserId() } }),
  getById: (id) => apiClient.get(`/categories/${id}`, { params: { userId: getUserId() } }),
  create: (data) => apiClient.post('/categories', data, { params: { userId: getUserId() } }),
  update: (id, data) => apiClient.put(`/categories/${id}`, data, { params: { userId: getUserId() } }),
  delete: (id) => apiClient.delete(`/categories/${id}`, { params: { userId: getUserId() } }),
};

// Transaction APIs
export const transactionAPI = {
  getAll: (params) => apiClient.get('/transactions', { params: { ...params, userId: getUserId() } }),
  getById: (id) => apiClient.get(`/transactions/${id}`, { params: { userId: getUserId() } }),
  getByAccount: (accountId, params) =>
    apiClient.get(`/transactions/account/${accountId}`, { params: { ...params, userId: getUserId() } }),
  create: (data) => apiClient.post('/transactions', data, { params: { userId: getUserId() } }),
  update: (id, data) => apiClient.put(`/transactions/${id}`, data, { params: { userId: getUserId() } }),
  delete: (id) => apiClient.delete(`/transactions/${id}`, { params: { userId: getUserId() } }),
  getMonthlyReport: (params) =>
    apiClient.get('/transactions/report/monthly', { params: { ...params, userId: getUserId() } }),
  getCategoryReport: (params) =>
    apiClient.get('/transactions/report/by-category', { params: { ...params, userId: getUserId() } }),
};

// Budget APIs
export const budgetAPI = {
  getAll: () => apiClient.get('/budgets', { params: { userId: getUserId() } }),
  getById: (id) => apiClient.get(`/budgets/${id}`, { params: { userId: getUserId() } }),
  create: (data) => apiClient.post('/budgets', data, { params: { userId: getUserId() } }),
  update: (id, data) => apiClient.put(`/budgets/${id}`, data, { params: { userId: getUserId() } }),
  delete: (id) => apiClient.delete(`/budgets/${id}`, { params: { userId: getUserId() } }),
  getStatus: () => apiClient.get('/budgets/status', { params: { userId: getUserId() } }),
};

export default apiClient;
