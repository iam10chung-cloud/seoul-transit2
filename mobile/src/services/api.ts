import axios from 'axios';
import { API_BASE_URL } from '@env';
import { 
  RoutesRequest, 
  RoutesResponse, 
  HealthResponse,
  AccessibleRoutesRequest,
  AccessibleRoutesResponse,
} from '../types/api';

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

  // Get routes (with accessibility support)
  getRoutes: async (request: RoutesRequest | AccessibleRoutesRequest): Promise<AccessibleRoutesResponse> => {
    const response = await api.post<AccessibleRoutesResponse>('/v1/routes', request);
    return response.data;
  },

  // Get station accessibility info
  getStationAccessibility: async (stationId: string) => {
    const response = await api.get(`/v1/accessibility/stations/${stationId}`);
    return response.data;
  },

  // Get all accessible stations
  getAllAccessibleStations: async (filters?: { wheelchairOnly?: boolean; elevatorOnly?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.wheelchairOnly) params.append('wheelchairOnly', 'true');
    if (filters?.elevatorOnly) params.append('elevatorOnly', 'true');
    
    const response = await api.get(`/v1/accessibility/stations?${params.toString()}`);
    return response.data;
  },
};

export default api;
