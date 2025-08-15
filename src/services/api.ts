import axios from 'axios';

// Configure axios base URL - update this with your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/api';

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
  getAll: (params?: { 
    topic?: string; 
    search?: string;
    page?: number;
    limit?: number;
    getAll?: boolean; // Set to true to get all questions without pagination
  }) => {
    // If getAll is true, set a very high limit to get all questions
    if (params?.getAll) {
      return api.get('/questions', { 
        params: { 
          ...params, 
          limit: 1000, // High limit to get all questions
          page: 1 
        } 
      });
    }
    return api.get('/questions', { params });
  },
  
  // Get all questions without pagination (for Question Scheduler)
  getAllQuestions: (params?: { topic?: string; search?: string }) => 
    api.get('/questions', { 
      params: { 
        ...params, 
        limit: 1000, // High limit to get all questions
        page: 1 
      } 
    }),
  
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
  // Get all question buckets with filtering and pagination
  getBuckets: (params?: {
    topic?: string;
    dayOfWeek?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) => api.get('/scheduling/buckets', { params }),
  
  // Get all buckets without pagination (for Question Scheduler)
  getAllBuckets: (params?: {
    topic?: string;
    dayOfWeek?: string;
    isActive?: boolean;
  }) => api.get('/scheduling/buckets', { 
    params: { 
      ...params, 
      limit: 1000, // High limit to get all buckets
      page: 1 
    } 
  }),
  
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
    targetGroupId: string; // Add Telegram group ID
  }) => api.post('/scheduling/buckets', data),
  
  // Update existing bucket
  updateBucket: (id: string, data: {
    name?: string;
    topic?: string;
    questions?: string[];
    maxQuestions?: number;
    dayOfWeek?: string;
    isActive?: boolean;
    targetGroupId?: string; // Add Telegram group ID
  }) => api.put(`/scheduling/buckets/${id}`, data),
  
  // Delete bucket
  deleteBucket: (id: string) => 
    api.delete(`/scheduling/buckets/${id}`),
  
  // Toggle bucket active status
  toggleBucketActive: (id: string, isActive: boolean) => 
    api.patch(`/scheduling/buckets/${id}/toggle`, { isActive }),
  
  // Get schedule for specific day
  getDaySchedule: (dayOfWeek: string, activeOnly: boolean = true) => 
    api.get(`/scheduling/days/${dayOfWeek}`, { params: { activeOnly } }),
  
  // Get weekly schedule overview
  getWeeklySchedule: (activeOnly: boolean = true) => 
    api.get('/scheduling/weekly', { params: { activeOnly } }),
  
  // Get topic-wise schedule summary
  getTopicSchedule: (topic: string, activeOnly: boolean = true) => 
    api.get(`/scheduling/topics/${topic}`, { params: { activeOnly } }),
  
  // Bulk update schedules
  updateSchedules: (schedules: Array<{
    id: string;
    dayOfWeek: string;
    isActive: boolean;
  }>) => api.put('/scheduling/bulk-update', { schedules }),
  
  // Add question to bucket
  addQuestionToBucket: (bucketId: string, questionId: string) => 
    api.post(`/scheduling/buckets/${bucketId}/questions/${questionId}`),
  
  // Remove question from bucket
  removeQuestionFromBucket: (bucketId: string, questionId: string) => 
    api.delete(`/scheduling/buckets/${bucketId}/questions/${questionId}`),
  
  // Get schedulable questions for a topic
  getSchedulableQuestions: (topic: string, params?: {
    page?: number;
    limit?: number;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    search?: string;
  }) => api.get(`/scheduling/questions/schedulable/${topic}`, { params }),
  
  // Manually trigger question sending for a bucket
  sendBucketQuestions: (bucketId: string, targetGroupId: string) => 
    api.post(`/scheduling/buckets/${bucketId}/send`, { targetGroupId }),
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

// Telegram Groups API
export const telegramGroupsAPI = {
  // Discover available Telegram groups
  discoverGroups: () => 
    api.post('/admin/telegram-groups/discover'),
  
  // Get all groups
  getAllGroups: () => 
    api.get('/admin/telegram-groups'),
  
  // Get group by ID
  getGroup: (id: string) => 
    api.get(`/admin/telegram-groups/${id}`),
  
  // Update group settings
  updateGroup: (id: string, data: {
    isActive?: boolean;
    name?: string;
  }) => api.put(`/admin/telegram-groups/${id}`, data),
};

export default api; 