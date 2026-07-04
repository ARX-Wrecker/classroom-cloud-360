<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\LessonCompletion;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Student's own learning progress analytics
     */
    public function myProgress(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $enrollments = Enrollment::with(['course', 'course.modules', 'course.lessons'])
                ->where('user_id', $user->id)
                ->get();

            $grades = Grade::where('user_id', $user->id)->get();

            $completedSubmissions = Submission::where('user_id', $user->id)
                ->where('status', 'graded')
                ->get();

            $weeklyActivity = LessonCompletion::where('user_id', $user->id)
                ->where('completed_at', '>=', now()->subDays(7))
                ->select(DB::raw("DATE(completed_at) as day"), DB::raw('COUNT(*) as lessons'))
                ->groupBy('day')
                ->orderBy('day')
                ->get();

            $courseProgress = $enrollments->map(function ($enrollment) use ($user) {
                $totalLessons    = $enrollment->course->lessons()->count();
                $completedLessons = LessonCompletion::where('user_id', $user->id)
                    ->where('enrollment_id', $enrollment->id)
                    ->count();

                return [
                    'course_id'         => $enrollment->course_id,
                    'course_title'      => $enrollment->course->title,
                    'progress'          => $enrollment->progress,
                    'total_lessons'     => $totalLessons,
                    'completed_lessons' => $completedLessons,
                    'status'            => $enrollment->status,
                    'started_at'        => $enrollment->started_at,
                    'completed_at'      => $enrollment->completed_at,
                ];
            });

            $averageScore = $grades->where('is_final', true)->avg('score');
            $passedQuizzes = Submission::where('user_id', $user->id)
                ->where('type', 'quiz')
                ->where('passed', true)
                ->count();
            $totalQuizzes = Submission::where('user_id', $user->id)
                ->where('type', 'quiz')
                ->count();

            return response()->json([
                'success' => true,
                'message' => 'Progreso de aprendizaje.',
                'data'    => [
                    'summary' => [
                        'total_courses'     => $enrollments->count(),
                        'completed_courses' => $enrollments->where('status', 'completed')->count(),
                        'average_progress'  => round($enrollments->avg('progress'), 2),
                        'average_score'     => round($averageScore ?? 0, 2),
                        'quizzes_passed'    => $passedQuizzes,
                        'quizzes_total'     => $totalQuizzes,
                        'quiz_pass_rate'    => $totalQuizzes > 0 ? round(($passedQuizzes / $totalQuizzes) * 100, 2) : 0,
                    ],
                    'course_progress'  => $courseProgress,
                    'weekly_activity'  => $weeklyActivity,
                    'recent_grades'    => $grades->sortByDesc('graded_at')->take(10)->values()->map(fn($g) => [
                        'score'        => $g->score,
                        'max_score'    => $g->max_score,
                        'letter_grade' => $g->letter_grade,
                        'graded_at'    => $g->graded_at,
                        'is_final'     => $g->is_final,
                    ]),
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el progreso.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin: platform-wide overview
     */
    public function overview(Request $request): JsonResponse
    {
        try {
            $tenantId = $request->user()->tenant_id;
            $period   = $request->get('period', '30'); // days

            $since = now()->subDays((int) $period);

            $newUsers = User::when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
                ->where('created_at', '>=', $since)
                ->count();

            $newEnrollments = Enrollment::when($tenantId, fn($q) => $q->whereHas('course', fn($cq) => $cq->where('tenant_id', $tenantId)))
                ->where('created_at', '>=', $since)
                ->count();

            $completedEnrollments = Enrollment::when($tenantId, fn($q) => $q->whereHas('course', fn($cq) => $cq->where('tenant_id', $tenantId)))
                ->where('status', 'completed')
                ->where('completed_at', '>=', $since)
                ->count();

            $userGrowth = User::when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
                ->where('created_at', '>=', now()->subMonths(6))
                ->select(DB::raw("DATE_TRUNC('month', created_at) as month"), DB::raw('COUNT(*) as total'))
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            $enrollmentGrowth = Enrollment::when($tenantId, fn($q) => $q->whereHas('course', fn($cq) => $cq->where('tenant_id', $tenantId)))
                ->where('created_at', '>=', now()->subMonths(6))
                ->select(DB::raw("DATE_TRUNC('month', created_at) as month"), DB::raw('COUNT(*) as total'))
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            $topCourses = Course::when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
                ->withCount('enrollments')
                ->orderBy('enrolled_count', 'desc')
                ->limit(10)
                ->get(['id', 'title', 'enrolled_count', 'rating', 'is_published']);

            return response()->json([
                'success' => true,
                'message' => 'Resumen de la plataforma.',
                'data'    => [
                    'period_days'          => $period,
                    'new_users'            => $newUsers,
                    'new_enrollments'      => $newEnrollments,
                    'completed_enrollments' => $completedEnrollments,
                    'user_growth'          => $userGrowth,
                    'enrollment_growth'    => $enrollmentGrowth,
                    'top_courses'          => $topCourses,
                    'totals'               => [
                        'users'       => User::when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))->count(),
                        'courses'     => Course::when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))->count(),
                        'enrollments' => Enrollment::when($tenantId, fn($q) => $q->whereHas('course', fn($cq) => $cq->where('tenant_id', $tenantId)))->count(),
                    ],
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el resumen.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin: per-course analytics
     */
    public function courses(Request $request): JsonResponse
    {
        try {
            $tenantId = $request->user()->tenant_id;

            $courses = Course::with('instructor')
                ->when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
                ->withCount(['enrollments', 'enrollments as completed_count' => fn($q) => $q->where('status', 'completed')])
                ->orderBy('enrolled_count', 'desc')
                ->paginate(20);

            $data = $courses->getCollection()->map(function ($course) {
                $avgProgress = Enrollment::where('course_id', $course->id)->avg('progress');
                return [
                    'id'               => $course->id,
                    'title'            => $course->title,
                    'instructor'       => $course->instructor->name ?? 'N/A',
                    'is_published'     => $course->is_published,
                    'level'            => $course->level,
                    'enrolled_count'   => $course->enrolled_count,
                    'completed_count'  => $course->completed_count ?? 0,
                    'completion_rate'  => $course->enrolled_count > 0
                        ? round((($course->completed_count ?? 0) / $course->enrolled_count) * 100, 2)
                        : 0,
                    'avg_progress'     => round($avgProgress ?? 0, 2),
                    'rating'           => $course->rating,
                    'rating_count'     => $course->rating_count,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Analíticas de cursos.',
                'data'    => $data,
                'meta'    => [
                    'current_page' => $courses->currentPage(),
                    'last_page'    => $courses->lastPage(),
                    'total'        => $courses->total(),
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener analíticas de cursos.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
