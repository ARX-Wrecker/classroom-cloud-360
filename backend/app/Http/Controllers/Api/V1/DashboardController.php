<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $data = match ($user->role) {
                'superadmin', 'admin' => $this->adminDashboard($user),
                'instructor'          => $this->instructorDashboard($user),
                default               => $this->studentDashboard($user),
            };

            return response()->json([
                'success' => true,
                'message' => 'Dashboard cargado correctamente.',
                'data'    => $data,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar el dashboard.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    private function adminDashboard(User $user): array
    {
        $tenantId = $user->tenant_id;

        $usersQuery    = User::query();
        $coursesQuery  = Course::query();
        $enrollQuery   = Enrollment::query();

        if ($tenantId && $user->role !== 'superadmin') {
            $usersQuery->where('tenant_id', $tenantId);
            $coursesQuery->where('tenant_id', $tenantId);
            $enrollQuery->whereHas('course', fn($q) => $q->where('tenant_id', $tenantId));
        }

        $totalUsers       = $usersQuery->count();
        $totalCourses     = $coursesQuery->count();
        $publishedCourses = (clone $coursesQuery)->where('is_published', true)->count();
        $totalEnrollments = $enrollQuery->count();
        $completedEnroll  = (clone $enrollQuery)->where('status', 'completed')->count();

        $recentUsers = User::when($tenantId && $user->role !== 'superadmin', fn($q) => $q->where('tenant_id', $tenantId))
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'email', 'role', 'created_at', 'avatar']);

        $popularCourses = Course::with('instructor')
            ->when($tenantId && $user->role !== 'superadmin', fn($q) => $q->where('tenant_id', $tenantId))
            ->orderBy('enrolled_count', 'desc')
            ->limit(5)
            ->get(['id', 'title', 'enrolled_count', 'rating', 'instructor_id', 'thumbnail']);

        $enrollmentsByMonth = Enrollment::select(
            DB::raw("DATE_TRUNC('month', created_at) as month"),
            DB::raw('COUNT(*) as total')
        )
            ->when($tenantId && $user->role !== 'superadmin', fn($q) => $q->whereHas('course', fn($cq) => $cq->where('tenant_id', $tenantId)))
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return [
            'role'             => $user->role,
            'stats'            => [
                'total_users'         => $totalUsers,
                'total_courses'       => $totalCourses,
                'published_courses'   => $publishedCourses,
                'total_enrollments'   => $totalEnrollments,
                'completed_enrollments' => $completedEnroll,
                'completion_rate'     => $totalEnrollments > 0
                    ? round(($completedEnroll / $totalEnrollments) * 100, 2)
                    : 0,
                'users_by_role'       => User::when($tenantId && $user->role !== 'superadmin', fn($q) => $q->where('tenant_id', $tenantId))
                    ->select('role', DB::raw('COUNT(*) as count'))
                    ->groupBy('role')
                    ->pluck('count', 'role'),
            ],
            'recent_users'     => $recentUsers,
            'popular_courses'  => $popularCourses,
            'enrollments_trend' => $enrollmentsByMonth,
            'notifications'    => Notification::where('user_id', $user->id)
                ->unread()
                ->limit(5)
                ->get(['id', 'type', 'title', 'body', 'created_at']),
        ];
    }

    private function instructorDashboard(User $user): array
    {
        $courses = Course::where('instructor_id', $user->id)->get();
        $courseIds = $courses->pluck('id');

        $totalStudents  = Enrollment::whereIn('course_id', $courseIds)->distinct('user_id')->count('user_id');
        $totalEnroll    = Enrollment::whereIn('course_id', $courseIds)->count();
        $completedEnroll = Enrollment::whereIn('course_id', $courseIds)->where('status', 'completed')->count();

        $recentEnrollments = Enrollment::with(['user', 'course'])
            ->whereIn('course_id', $courseIds)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $courseStats = Course::where('instructor_id', $user->id)
            ->withCount('enrollments')
            ->orderBy('enrolled_count', 'desc')
            ->get(['id', 'title', 'is_published', 'rating', 'enrolled_count', 'thumbnail']);

        return [
            'role'  => 'instructor',
            'stats' => [
                'total_courses'     => $courses->count(),
                'published_courses' => $courses->where('is_published', true)->count(),
                'total_students'    => $totalStudents,
                'total_enrollments' => $totalEnroll,
                'completion_rate'   => $totalEnroll > 0
                    ? round(($completedEnroll / $totalEnroll) * 100, 2)
                    : 0,
                'average_rating'    => round($courses->avg('rating'), 2),
            ],
            'courses'            => $courseStats,
            'recent_enrollments' => $recentEnrollments,
            'notifications'      => Notification::where('user_id', $user->id)
                ->unread()->limit(5)->get(['id', 'type', 'title', 'body', 'created_at']),
        ];
    }

    private function studentDashboard(User $user): array
    {
        $enrollments = Enrollment::with(['course', 'course.instructor', 'course.category'])
            ->where('user_id', $user->id)
            ->orderBy('last_accessed_at', 'desc')
            ->get();

        $completedCourses = $enrollments->where('status', 'completed')->count();
        $certificates     = Certificate::where('user_id', $user->id)->count();

        $inProgress = $enrollments->filter(fn($e) => $e->status === 'active' && $e->progress < 100)
            ->sortByDesc('last_accessed_at')
            ->take(5)
            ->values();

        $totalLessons    = 0;
        $completedLessons = 0;

        foreach ($enrollments as $enrollment) {
            $courseLessons = Lesson::whereHas('module', fn($q) => $q->where('course_id', $enrollment->course_id))->count();
            $done = LessonCompletion::where('enrollment_id', $enrollment->id)->count();
            $totalLessons     += $courseLessons;
            $completedLessons += $done;
        }

        return [
            'role'  => 'student',
            'stats' => [
                'enrolled_courses'  => $enrollments->count(),
                'completed_courses' => $completedCourses,
                'certificates'      => $certificates,
                'lessons_completed' => $completedLessons,
                'total_lessons'     => $totalLessons,
                'overall_progress'  => $totalLessons > 0
                    ? round(($completedLessons / $totalLessons) * 100, 2)
                    : 0,
            ],
            'in_progress_courses' => $inProgress->map(fn($e) => [
                'enrollment_id' => $e->id,
                'course_id'     => $e->course_id,
                'title'         => $e->course->title,
                'thumbnail'     => $e->course->thumbnail,
                'instructor'    => $e->course->instructor->name ?? 'N/A',
                'progress'      => $e->progress,
                'last_accessed' => $e->last_accessed_at,
            ]),
            'recent_certificates' => Certificate::with('course')
                ->where('user_id', $user->id)
                ->orderBy('issued_at', 'desc')
                ->limit(3)
                ->get(['id', 'course_id', 'verification_code', 'issued_at']),
            'notifications' => Notification::where('user_id', $user->id)
                ->unread()->limit(5)->get(['id', 'type', 'title', 'body', 'created_at']),
        ];
    }
}
