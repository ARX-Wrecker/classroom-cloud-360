import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi, categoriesApi } from '@/lib/api';
import toast from 'react-hot-toast';

export function useCourses(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: async () => {
      const { data } = await coursesApi.list(params);
      // backend: { success, data: [...], meta: {...} }
      return data;
    },
  });
}

export function useCourse(id: number | string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const { data } = await coursesApi.get(id);
      return data?.data ?? data;
    },
    enabled: !!id,
  });
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const { data } = await coursesApi.myEnrollments();
      return data?.data ?? [];
    },
    retry: false,
  });
}

export function useEnrollCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => coursesApi.enroll(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollments'] });
      qc.invalidateQueries({ queryKey: ['courses'] });
      toast.success('¡Inscripción exitosa!');
    },
    onError: () => toast.error('Error al inscribirse en el curso'),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await categoriesApi.list();
      return data?.data ?? [];
    },
  });
}

export function useCompleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: number) => coursesApi.completeLesson(lessonId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollments'] });
      toast.success('Lección completada ✓');
    },
  });
}
