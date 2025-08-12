import axios from 'axios';

// Configure axios base URL - update this with your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Questions API
export const questionsAPI = {
  getAll: (params?: { topic?: string; search?: string }) => 
    api.get('/questions', { params }),
  
  getById: (id: string) => 
    api.get(`/questions/${id}`),
  
  create: (data: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    topic: string;
  }) => api.post('/questions', data),
  
  update: (id: string, data: {
    question?: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
    topic?: string;
    isActive?: boolean;
  }) => api.put(`/questions/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/questions/${id}`),
  
  toggleActive: (id: string, isActive: boolean) => 
    api.patch(`/questions/${id}/toggle`, { isActive }),
  
  getDailyQuestions: () => 
    api.get('/questions/daily'),
};

// Bot API
export const botAPI = {
  getStatus: () => 
    api.get('/bot/status'),
  
  sendTestMessage: () => 
    api.post('/bot/test-message'),
  
  updateSchedule: (schedule: string) => 
    api.put('/bot/schedule', { schedule }),
};

// Scheduling API
export const schedulingAPI = {
  // Get all question buckets
  getBuckets: () => 
    api.get('/scheduling/buckets'),
  
  // Get bucket by ID
  getBucket: (id: string) => 
    api.get(`/scheduling/buckets/${id}`),
  
  // Create new question bucket
  createBucket: (data: {
    name: string;
    topic: string;
    questions: string[];
    maxQuestions: number;
    dayOfWeek: string;
  }) => api.post('/scheduling/buckets', data),
  
  // Update existing bucket
  updateBucket: (id: string, data: {
    name?: string;
    topic?: string;
    questions?: string[];
    maxQuestions?: number;
    dayOfWeek?: string;
  }) => api.put(`/scheduling/buckets/${id}`, data),
  
  // Delete bucket
  deleteBucket: (id: string) => 
    api.delete(`/scheduling/buckets/${id}`),
  
  // Toggle bucket active status
  toggleBucketActive: (id: string, isActive: boolean) => 
    api.patch(`/scheduling/buckets/${id}/toggle`, { isActive }),
  
  // Get schedule for specific day
  getDaySchedule: (dayOfWeek: string) => 
    api.get(`/scheduling/days/${dayOfWeek}`),
  
  // Get weekly schedule overview
  getWeeklySchedule: () => 
    api.get('/scheduling/weekly'),
  
  // Get topic-wise schedule summary
  getTopicSchedule: (topic: string) => 
    api.get(`/scheduling/topics/${topic}`),
  
  // Bulk update schedules
  updateSchedules: (schedules: Array<{
    id: string;
    dayOfWeek: string;
    isActive: boolean;
  }>) => api.put('/scheduling/bulk-update', { schedules }),
};

// Auth API (for future use)
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getProfile: () => 
    api.get('/auth/profile'),
};

export default api; 