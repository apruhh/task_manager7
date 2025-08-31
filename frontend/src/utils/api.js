import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and log responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid, clear storage and redirect
      console.log('🔄 Authentication error detected, clearing storage and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to create authenticated axios instance
export const createAuthAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// API endpoints
export const authAPI = {
  login: (credentials) => {
    console.log('🔐 Login API call with credentials:', { username: credentials.username, hasPassword: !!credentials.password });
    return api.post('/api/login', credentials);
  },
  signup: (userData) => {
    console.log('📝 Signup API call with user data:', { username: userData.username, hasPassword: !!userData.password });
    return api.post('/api/signup', userData);
  },
  profile: () => {
    console.log('👤 Profile API call');
    return api.get('/api/profile');
  },
};

export const notesAPI = {
  getAll: () => {
    console.log('📋 Get all notes API call');
    return api.get('/notes');
  },
  create: (noteData) => {
    console.log('➕ Create note API call:', noteData);
    return api.post('/notes', noteData);
  },
  update: (id, noteData) => {
    console.log('✏️ Update note API call:', { id, data: noteData });
    return api.put(`/notes/${id}`, noteData);
  },
  delete: (id) => {
    console.log('🗑️ Delete note API call:', { id });
    return api.delete(`/notes/${id}`);
  },
};

// Health check function
export const checkServerHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log('🏥 Server health check:', response.data);
    return response.data;
  } catch (error) {
    console.error('🏥 Server health check failed:', error);
    throw error;
  }
};

// Test endpoint function
export const testBackendConnection = async () => {
  try {
    console.log('🧪 Testing backend connection...');
    const response = await axios.get(`${API_BASE_URL}/test`);
    console.log('✅ Backend test endpoint response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Backend test endpoint failed:', error);
    throw error;
  }
};

export default api;
