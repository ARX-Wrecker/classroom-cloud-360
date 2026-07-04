import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, login, logout, fetchMe, setUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchMe();
    }
  }, [isAuthenticated, user, fetchMe]);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isInstructor = user?.role === 'instructor';
  const isStudent = user?.role === 'student';
  const canManage = isAdmin || isInstructor;

  return { user, token, isAuthenticated, isLoading, login, logout, fetchMe, setUser, isAdmin, isInstructor, isStudent, canManage };
}
