import axios from 'axios';
import { API_BASE_URL } from '@env';
import { RoutesRequest, RoutesResponse, HealthResponse } from '../types/api';

const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging (dev only)
api.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  getHealth: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>('/v1/health');
    return response.data;
  },

  // Get routes
  getRoutes: async (request: RoutesRequest): Promise<RoutesResponse> => {
    const response = await api.post<RoutesResponse>('/v1/routes', request);
    return response.data;
  },
};

export default api;
