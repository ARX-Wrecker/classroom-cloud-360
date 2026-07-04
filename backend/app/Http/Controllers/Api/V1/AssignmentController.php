<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AssignmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $query = Assignment::with(['course', 'submissions' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }]);

            if ($user->isStudent()) {
                $query->whereHas('course.enrollments', fn($q) => $q->where('user_id', $user->id));
            } elseif ($user->isInstructor()) {
                $query->whereHas('course', fn($q) => $q->where('instructor_id', $user->id));
            }

            if ($request->filled('course_id')) {
                $query->where('course_id', $request->course_id);
            }

            $assignments = $query->orderBy('due_date', 'asc')->paginate(20);

            $data = $assignments->map(function ($a) use ($user) {
                $submission = $a->submissions->first();
                return [
                    'id'          => $a->id,
                    'title'       => $a->title,
                    'description' => $a->description,
                    'due_date'    => $a->due_date,
                    'max_score'   => $a->max_score ?? 100,
                    'course'      => ['id' => $a->course?->id, 'title' => $a->course?->title],
                    'status'      => $submission
                        ? ($submission->grade !== null ? 'graded' : 'submitted')
                        : (now()->gt($a->due_date) ? 'late' : 'pending'),
                    'submission'  => $submission ? [
                        'id'         => $submission->id,
                        'content'    => $submission->content,
                        'file_url'   => $submission->file_path ? Storage::url($submission->file_path) : null,
                        'grade'      => $submission->grade,
                        'feedback'   => $submission->feedback,
                        'created_at' => $submission->created_at,
                    ] : null,
                ];
            });

            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'course_id'   => 'required|exists:courses,id',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date'    => 'required|date',
            'max_score'   => 'nullable|numeric|min:0',
        ]);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $assignment = Assignment::create([
            'course_id'   => $request->course_id,
            'title'       => $request->title,
            'description' => $request->description,
            'due_date'    => $request->due_date,
            'max_score'   => $request->max_score ?? 100,
        ]);

        return response()->json(['success' => true, 'data' => $assignment], 201);
    }

    public function submit(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'content' => 'nullable|string',
            'file'    => 'nullable|file|max:20480',
        ]);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $assignment = Assignment::findOrFail($id);
        $user       = $request->user();

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store("submissions/{$user->id}", 'public');
        }

        $submission = Submission::updateOrCreate(
            ['assignment_id' => $assignment->id, 'user_id' => $user->id],
            ['content' => $request->content, 'file_path' => $filePath]
        );

        return response()->json([
            'success' => true,
            'message' => 'Tarea enviada exitosamente.',
            'data'    => [
                'id'       => $submission->id,
                'file_url' => $filePath ? Storage::url($filePath) : null,
            ],
        ]);
    }

    public function grade(Request $request, int $id): JsonResponse
    {
        $submission = Submission::findOrFail($id);
        $submission->update([
            'grade'    => $request->grade,
            'feedback' => $request->feedback,
        ]);
        return response()->json(['success' => true, 'message' => 'Calificación guardada.']);
    }
}
