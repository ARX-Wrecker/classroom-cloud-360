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
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user    = $request->user();
            $cacheKey = "dashboard:{$user->id}:{$user->role}";

            $data = Cache::remember($cacheKey, 60, function () use ($user) {
                return match ($user->role) {
                    'superadmin', 'admin' => $this->adminDashboard($user),
                    'instructor'          => $this->instructorDashboard($user),
                    default               => $this->studentDashboard($user),
                };
            });

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
        $tenantId  = $user->tenant_id;
        $isTenant  = $tenantId && $user->role !== 'superadmin';

        // Single aggregated query instead of multiple counts
        $stats = DB::selectOne("
            SELECT
                COUNT(DISTINCT u.id)                                            AS total_users,
                COUNT(DISTINCT c.id)                                            AS total_courses,
                COUNT(DISTINCT CASE WHEN c.is_published THEN c.id END)         AS published_courses,
                COUNT(DISTINCT e.id)                                            AS total_enrollments,
                COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.id END) AS completed_enrollments
            FROM users u
            LEFT JOIN courses c ON " . ($isTenant ? "c.tenant_id = :tid1" : "1=1") . "
            LEFT JOIN enrollments e ON e.course_id = c.id
            WHERE " . ($isTenant ? "u.tenant_id = :tid2" : "1=1"),
            $isTenant ? ['tid1' => $tenantId, 'tid2' => $tenantId] : []
        );

        $total = (int) $stats->total_enrollments;
        $done  = (int) $stats->completed_enrollments;

        $recentUsers = User::when($isTenant, fn($q) => $q->where('tenant_id', $tenantId))
            ->latest()->limit(5)->get(['id', 'name', 'email', 'role', 'created_at', 'avatar']);

        $popularCourses = Course::with('instructor:id,name')
            ->when($isTenant, fn($q) => $q->where('tenant_id', $tenantId))
            ->orderByDesc('enrolled_count')->limit(5)
            ->get(['id', 'title', 'enrolled_count', 'rating', 'instructor_id', 'thumbnail']);

        $enrollmentsByMonth = Enrollment::select(
            DB::raw("DATE_TRUNC('month', created_at) as month"),
            DB::raw('COUNT(*) as total')
        )
            ->when($isTenant, fn($q) => $q->whereHas('course', fn($cq) => $cq->where('tenant_id', $tenantId)))
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')->orderBy('month')->get();

        $usersByRole = User::when($isTenant, fn($q) => $q->where('tenant_id', $tenantId))
            ->select('role', DB::raw('COUNT(*) as count'))
            ->groupBy('role')->pluck('count', 'role');

        return [
            'role'   => $user->role,
            'stats'  => [
                'total_users'            => (int) $stats->total_users,
                'total_courses'          => (int) $stats->total_courses,
                'published_courses'      => (int) $stats->published_courses,
                'total_enrollments'      => $total,
                'completed_enrollments'  => $done,
                'completion_rate'        => $total > 0 ? round(($done / $total) * 100, 2) : 0,
                'users_by_role'          => $usersByRole,
            ],
            'recent_users'      => $recentUsers,
            'popular_courses'   => $popularCourses,
            'enrollments_trend' => $enrollmentsByMonth,
            'notifications'     => Notification::where('user_id', $user->id)
                ->unread()->limit(5)->get(['id', 'type', 'title', 'body', 'created_at']),
        ];
    }

    private function instructorDashboard(User $user): array
    {
        $courseIds = Course::where('instructor_id', $user->id)->pluck('id');

        // Single aggregated query
        $stats = Enrollment::whereIn('course_id', $courseIds)->selectRaw(
            'COUNT(*) as total,
             COUNT(DISTINCT user_id) as unique_students,
             SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as completed',
            ['completed']
        )->first();

        $total = (int) $stats->total;
        $done  = (int) $stats->completed;

        $courseStats = Course::where('instructor_id', $user->id)
            ->withCount('enrollments')->orderByDesc('enrolled_count')
            ->get(['id', 'title', 'is_published', 'rating', 'enrolled_count', 'thumbnail']);

        $recentEnrollments = Enrollment::with(['user:id,name,email,avatar', 'course:id,title'])
            ->whereIn('course_id', $courseIds)->latest()->limit(10)->get();

        return [
            'role'  => 'instructor',
            'stats' => [
                'total_courses'     => $courseIds->count(),
                'published_courses' => Course::where('instructor_id', $user->id)->where('is_published', true)->count(),
                'total_students'    => (int) $stats->unique_students,
                'total_enrollments' => $total,
                'completion_rate'   => $total > 0 ? round(($done / $total) * 100, 2) : 0,
                'average_rating'    => round(Course::where('instructor_id', $user->id)->avg('rating') ?? 0, 2),
            ],
            'courses'            => $courseStats,
            'recent_enrollments' => $recentEnrollments,
            'notifications'      => Notification::where('user_id', $user->id)
                ->unread()->limit(5)->get(['id', 'type', 'title', 'body', 'created_at']),
        ];
    }

    private function studentDashboard(User $user): array
    {
        // Fix N+1: load all enrollments with relations in ONE query
        $enrollments = Enrollment::with([
            'course:id,title,thumbnail,instructor_id,category_id',
            'course.instructor:id,name',
            'course.category:id,name',
        ])
            ->where('user_id', $user->id)
            ->orderByDesc('last_accessed_at')
            ->get();

        $enrollmentIds = $enrollments->pluck('id');
        $courseIds     = $enrollments->pluck('course_id');

        // Fix N+1: aggregate lesson counts in two queries (not one per enrollment)
        $totalLessonsPerCourse = Lesson::whereHas('module', fn($q) => $q->whereIn('course_id', $courseIds))
            ->join('modules', 'lessons.module_id', '=', 'modules.id')
            ->select('modules.course_id', DB::raw('COUNT(*) as total'))
            ->groupBy('modules.course_id')
            ->pluck('total', 'modules.course_id');

        $completedPerEnrollment = LessonCompletion::whereIn('enrollment_id', $enrollmentIds)
            ->select('enrollment_id', DB::raw('COUNT(*) as done'))
            ->groupBy('enrollment_id')
            ->pluck('done', 'enrollment_id');

        $totalLessons    = 0;
        $completedLessons = 0;

        foreach ($enrollments as $e) {
            $totalLessons     += (int) ($totalLessonsPerCourse[$e->course_id] ?? 0);
            $completedLessons += (int) ($completedPerEnrollment[$e->id] ?? 0);
        }

        $completedCourses = $enrollments->where('status', 'completed')->count();
        $certificates     = Certificate::where('user_id', $user->id)->count();

        $inProgress = $enrollments
            ->filter(fn($e) => $e->status === 'active' && $e->progress < 100)
            ->sortByDesc('last_accessed_at')->take(5)->values();

        return [
            'role'  => 'student',
            'stats' => [
                'enrolled_courses'  => $enrollments->count(),
                'completed_courses' => $completedCourses,
                'certificates'      => $certificates,
                'lessons_completed' => $completedLessons,
                'total_lessons'     => $totalLessons,
                'overall_progress'  => $totalLessons > 0
                    ? round(($completedLessons / $totalLessons) * 100, 2) : 0,
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
            'recent_certificates' => Certificate::with('course:id,title')
                ->where('user_id', $user->id)->latest('issued_at')->limit(3)
                ->get(['id', 'course_id', 'verification_code', 'issued_at']),
            'notifications' => Notification::where('user_id', $user->id)
                ->unread()->limit(5)->get(['id', 'type', 'title', 'body', 'created_at']),
        ];
    }
}
