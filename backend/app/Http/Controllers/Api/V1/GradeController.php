<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user->isStudent()) {
                $enrollments = Enrollment::with(['course', 'grades'])
                    ->where('user_id', $user->id)
                    ->get();

                $data = $enrollments->map(fn($e) => [
                    'course'   => ['id' => $e->course?->id, 'title' => $e->course?->title],
                    'progress' => $e->progress,
                    'grades'   => $e->grades->map(fn($g) => [
                        'id'          => $g->id,
                        'item'        => $g->gradable_type ?? 'Evaluación',
                        'score'       => $g->score,
                        'max_score'   => $g->max_score,
                        'percentage'  => $g->max_score > 0 ? round(($g->score / $g->max_score) * 100, 1) : 0,
                        'created_at'  => $g->created_at,
                    ]),
                    'average'  => $e->grades->count() > 0
                        ? round($e->grades->avg(fn($g) => $g->max_score > 0 ? ($g->score / $g->max_score) * 100 : 0), 1)
                        : null,
                ]);

                return response()->json(['success' => true, 'data' => $data]);
            }

            // Instructor / Admin: return grades for their courses
            $grades = Grade::with(['user', 'enrollment.course'])
                ->whereHas('enrollment.course', fn($q) => $q->where('instructor_id', $user->id))
                ->orderBy('created_at', 'desc')
                ->paginate(50);

            return response()->json(['success' => true, 'data' => $grades]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
