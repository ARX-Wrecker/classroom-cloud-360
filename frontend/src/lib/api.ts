import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim())
  ? process.env.NEXT_PUBLIC_API_URL.trim()
  : 'https://backend-production-72a5.up.railway.app/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 45000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('cc360_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== 'undefined') {
        const onAuthPage = ['/login', '/register', '/'].some(p => window.location.pathname === p || window.location.pathname.startsWith('/oauth'));
        if (!onAuthPage) {
          localStorage.removeItem('cc360_token');
          document.cookie = 'cc360_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data: Record<string, unknown>) => api.patch('/auth/profile', data),
  changePassword: (data: { old_password: string; new_password: string }) =>
    api.post('/auth/change-password', data),
};

// Courses
export const coursesApi = {
  list: (params?: Record<string, string | number>) => api.get('/courses', { params }),
  get: (id: number | string) => api.get(`/courses/${id}`),
  create: (data: FormData | Record<string, unknown>) => api.post('/courses', data),
  update: (id: number, data: FormData | Record<string, unknown>) => api.patch(`/courses/${id}`, data),
  delete: (id: number) => api.delete(`/courses/${id}`),
  enroll: (id: number) => api.post(`/courses/${id}/enroll`),
  myCourses: () => api.get('/my-courses'),
  myEnrollments: () => api.get('/my-courses'),
  completeLesson: (lessonId: number) => api.post(`/lessons/${lessonId}/complete`),
};

// Categories
export const categoriesApi = {
  list: () => api.get('/categories'),
};

// Dashboard
export const dashboardApi = {
  index: () => api.get('/dashboard'),
  stats: () => api.get('/dashboard'),
};

// Users
export const usersApi = {
  list: (params?: Record<string, string | number>) => api.get('/users', { params }),
  get: (id: number) => api.get(`/users/${id}`),
  update: (id: number, data: Record<string, unknown>) => api.patch(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
  updateRole: (id: number, role: string) => api.patch(`/users/${id}`, { role }),
  toggleActive: (id: number, is_active: boolean) => api.patch(`/users/${id}`, { is_active }),
};

// Notifications
export const notificationsApi = {
  list: () => api.get('/notifications'),
  markRead: (id: number) => api.post(`/notifications/${id}/read`),
};

// Certificates
export const certificatesApi = {
  list: () => api.get('/certificates'),
  generate: (enrollmentId: number) => api.post(`/certificates/generate/${enrollmentId}`),
  verify: (code: string) => api.get(`/certificates/verify/${code}`),
  download: (id: number) => api.get(`/certificates/${id}/download`, { responseType: 'blob' }),
};

// Messages
export const messagesApi = {
  list: () => api.get('/messages'),
  conversations: () => api.get('/messages'),
  thread: (userId: number) => api.get(`/messages?user_id=${userId}`),
  send: (data: { receiver_id: number; content: string }) => api.post('/messages', data),
};

// Forum
export const forumApi = {
  list: (params?: Record<string, string | number>) => api.get('/forum', { params }),
  get: (id: number) => api.get(`/forum/${id}`),
  create: (data: Record<string, unknown>) => api.post('/forum', data),
  reply: (id: number, data: Record<string, unknown>) => api.post(`/forum/${id}/reply`, data),
};

// Assignments
export const assignmentsApi = {
  list: (params?: Record<string, string | number>) => api.get('/assignments', { params }),
  create: (data: Record<string, unknown>) => api.post('/assignments', data),
  submit: (id: number, formData: FormData) =>
    api.post(`/assignments/${id}/submit`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  grade: (submissionId: number, data: { grade: number; feedback?: string }) =>
    api.post(`/submissions/${submissionId}/grade`, data),
};

// Documents
export const documentsApi = {
  list: (params?: Record<string, string | number>) => api.get('/documents', { params }),
  upload: (formData: FormData) =>
    api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/documents/${id}`),
};

// Grades
export const gradesApi = {
  list: () => api.get('/grades'),
};

// Quizzes
export const quizzesApi = {
  list: (params?: Record<string, string | number>) => api.get('/quizzes', { params }),
  get: (id: number) => api.get(`/quizzes/${id}`),
  submit: (id: number, data: { answers: Record<string, number> }) =>
    api.post(`/quizzes/${id}/submit`, data),
};

// Analytics
export const analyticsApi = {
  overview: () => api.get('/analytics/overview'),
  courses: () => api.get('/analytics/courses'),
  myProgress: () => api.get('/analytics/my-progress'),
};
