<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\LessonResource;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Models\Module;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    public function index(int $moduleId): JsonResponse
    {
        try {
            $module  = Module::findOrFail($moduleId);
            $lessons = $module->lessons()->get();

            return response()->json([
                'success' => true,
                'message' => 'Lecciones del módulo.',
                'data'    => LessonResource::collection($lessons),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener lecciones.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request, int $moduleId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'            => 'required|string|max:255',
            'content'          => 'sometimes|string',
            'video_url'        => 'sometimes|nullable|string',
            'duration_seconds' => 'sometimes|integer|min:0',
            'order'            => 'sometimes|integer|min:0',
            'type'             => 'sometimes|in:video,text,quiz,live',
            'is_preview'       => 'sometimes|boolean',
            'attachments'      => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $module = Module::findOrFail($moduleId);
            $user   = $request->user();

            if ($module->course->instructor_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para agregar lecciones a este módulo.',
                ], 403);
            }

            $data              = $validator->validated();
            $data['module_id'] = $module->id;
            if (!isset($data['order'])) {
                $data['order'] = $module->lessons()->max('order') + 1;
            }

            $lesson = Lesson::create($data);

            // Update course total lessons count
            $course = $module->course;
            $course->update(['total_lessons' => $course->lessons()->count()]);

            return response()->json([
                'success' => true,
                'message' => 'Lección creada correctamente.',
                'data'    => new LessonResource($lesson),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la lección.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Request $request, int $moduleId, int $lessonId): JsonResponse
    {
        try {
            $lesson = Lesson::where('module_id', $moduleId)->findOrFail($lessonId);

            // Check access: must be enrolled or instructor or admin
            $user = $request->user();
            if (!$lesson->is_preview && $user) {
                $courseId   = $lesson->module->course_id;
                $isEnrolled = Enrollment::where('user_id', $user->id)
                    ->where('course_id', $courseId)
                    ->exists();
                $isInstructor = $lesson->module->course->instructor_id === $user->id;

                if (!$isEnrolled && !$isInstructor && !$user->isAdmin()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Debes estar inscrito en el curso para ver esta lección.',
                    ], 403);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Detalle de la lección.',
                'data'    => new LessonResource($lesson),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lección no encontrada.',
                'error'   => $e->getMessage(),
            ], 404);
        }
    }

    public function update(Request $request, int $moduleId, int $lessonId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'            => 'sometimes|string|max:255',
            'content'          => 'sometimes|string',
            'video_url'        => 'sometimes|nullable|string',
            'duration_seconds' => 'sometimes|integer|min:0',
            'order'            => 'sometimes|integer|min:0',
            'type'             => 'sometimes|in:video,text,quiz,live',
            'is_preview'       => 'sometimes|boolean',
            'is_published'     => 'sometimes|boolean',
            'attachments'      => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $lesson = Lesson::where('module_id', $moduleId)->findOrFail($lessonId);
            $user   = $request->user();

            if ($lesson->module->course->instructor_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para editar esta lección.',
                ], 403);
            }

            $lesson->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Lección actualizada correctamente.',
                'data'    => new LessonResource($lesson->fresh()),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la lección.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, int $moduleId, int $lessonId): JsonResponse
    {
        try {
            $lesson = Lesson::where('module_id', $moduleId)->findOrFail($lessonId);
            $user   = $request->user();

            if ($lesson->module->course->instructor_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para eliminar esta lección.',
                ], 403);
            }

            $course = $lesson->module->course;
            $lesson->delete();
            $course->update(['total_lessons' => $course->lessons()->count()]);

            return response()->json([
                'success' => true,
                'message' => 'Lección eliminada correctamente.',
                'data'    => null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la lección.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function markComplete(Request $request, int $lessonId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'watch_time_seconds' => 'sometimes|integer|min:0',
        ]);

        try {
            $lesson = Lesson::findOrFail($lessonId);
            $user   = $request->user();
            $courseId = $lesson->module->course_id;

            $enrollment = Enrollment::where('user_id', $user->id)
                ->where('course_id', $courseId)
                ->firstOrFail();

            $completion = LessonCompletion::firstOrCreate(
                [
                    'lesson_id'     => $lesson->id,
                    'user_id'       => $user->id,
                ],
                [
                    'enrollment_id'       => $enrollment->id,
                    'completed_at'        => now(),
                    'watch_time_seconds'  => $request->watch_time_seconds ?? 0,
                ]
            );

            // Update enrollment progress
            $enrollment->updateProgress();

            return response()->json([
                'success' => true,
                'message' => $completion->wasRecentlyCreated ? 'Lección marcada como completada.' : 'Lección ya estaba completada.',
                'data'    => [
                    'lesson_id'   => $lesson->id,
                    'completed'   => true,
                    'progress'    => $enrollment->fresh()->progress,
                    'completed_at' => $completion->completed_at,
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al marcar la lección como completada.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
