export interface User {
  id: number;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'instructor' | 'student';
  avatar?: string;
  bio?: string;
  phone?: string;
  country?: string;
  language?: string;
  timezone?: string;
  two_factor_enabled?: boolean;
  is_active: boolean;
  last_login_at?: string;
  email_verified_at?: string;
  created_at: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  is_free: boolean;
  price?: number;
  is_published: boolean;
  instructor: User;
  category: Category;
  modules_count: number;
  lessons_count: number;
  enrollments_count: number;
  duration_hours: number;
  language: string;
  created_at: string;
}

export interface Module {
  id: number;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  content?: string;
  video_url?: string;
  duration_seconds?: number;
  order: number;
  type: 'video' | 'text' | 'quiz';
  is_completed?: boolean;
}

export interface Enrollment {
  id: number;
  course: Course;
  progress: number;
  completed_at?: string;
  enrolled_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  courses_count?: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read_at?: string;
  created_at: string;
}

export interface DashboardStats {
  total_courses?: number;
  total_students?: number;
  total_instructors?: number;
  enrolled_courses?: number;
  completed_courses?: number;
  total_progress?: number;
  recent_activity?: ActivityItem[];
  total_users?: number;
  revenue?: number;
  avg_rating?: number;
}

export interface ActivityItem {
  id: number;
  type: string;
  description: string;
  created_at: string;
  user?: Pick<User, 'id' | 'name' | 'avatar'>;
}

export interface Certificate {
  id: number;
  course: Course;
  issued_at: string;
  verification_code: string;
  pdf_url?: string;
}

export interface Message {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  read_at?: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  participant: User;
  last_message?: Message;
  unread_count: number;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}
