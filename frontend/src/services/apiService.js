import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Article Service
export const articleService = {
  getAll: (params = {}) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
  publish: (id) => api.post(`/articles/${id}/publish`),
  getPublished: (params = {}) => api.get('/articles/published', { params }),
  getMostViewed: () => api.get('/articles/most-viewed'),
  search: (keyword, params = {}) => api.get('/articles', { params: { search: keyword, ...params } }),
};

// Tag Service
export const tagService = {
  getAll: (params = {}) => api.get('/tags', { params }),
  getById: (id) => api.get(`/tags/${id}`),
  create: (data) => api.post('/tags', data),
  update: (id, data) => api.put(`/tags/${id}`, data),
  delete: (id) => api.delete(`/tags/${id}`),
  getPopular: (limit = 10) => api.get('/tags/popular', { params: { limit } }),
  search: (name, params = {}) => api.get('/tags', { params: { search: name, ...params } }),
};

// Schedule Service
export const scheduleService = {
  getAll: (params = {}) => api.get('/schedules', { params }),
  getById: (id) => api.get(`/schedules/${id}`),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
  execute: (id) => api.post(`/schedules/${id}/execute`),
  cancel: (id) => api.post(`/schedules/${id}/cancel`),
};

export default api; 