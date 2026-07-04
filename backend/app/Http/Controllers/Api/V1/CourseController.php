<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Course::with(['instructor', 'category'])
                ->published();

            if ($request->filled('search')) {
                $query->search($request->search);
            }
            if ($request->filled('category')) {
                $query->byCategory((int) $request->category);
            }
            if ($request->filled('level')) {
                $query->byLevel($request->level);
            }
            if ($request->filled('instructor')) {
                $query->where('instructor_id', $request->instructor);
            }
            if ($request->filled('is_free')) {
                $query->where('is_free', filter_var($request->is_free, FILTER_VALIDATE_BOOLEAN));
            }
            if ($request->filled('language')) {
                $query->where('language', $request->language);
            }

            $sortField = $request->get('sort_by', 'created_at');
            $sortDir   = $request->get('sort_dir', 'desc');
            $allowed   = ['created_at', 'title', 'price', 'rating', 'enrolled_count'];
            if (in_array($sortField, $allowed)) {
                $query->orderBy($sortField, $sortDir === 'asc' ? 'asc' : 'desc');
            }

            $perPage = min((int) $request->get('per_page', 15), 50);
            $courses = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Listado de cursos.',
                'data'    => CourseResource::collection($courses),
                'meta'    => [
                    'current_page' => $courses->currentPage(),
                    'last_page'    => $courses->lastPage(),
                    'per_page'     => $courses->perPage(),
                    'total'        => $courses->total(),
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los cursos.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'             => 'required|string|max:255',
            'description'       => 'required|string',
            'short_description' => 'sometimes|string|max:500',
            'price'             => 'required|numeric|min:0',
            'is_free'           => 'sometimes|boolean',
            'category_id'       => 'required|exists:categories,id',
            'level'             => 'required|in:beginner,intermediate,advanced',
            'language'          => 'sometimes|string|max:10',
            'thumbnail'         => 'sometimes|nullable|string',
            'requirements'      => 'sometimes|array',
            'what_you_learn'    => 'sometimes|array',
            'tags'              => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $data = $validator->validated();
            $data['instructor_id'] = $request->user()->id;
            $data['tenant_id']     = $request->user()->tenant_id;
            $data['slug']          = Str::slug($data['title']) . '-' . Str::random(6);
            $data['is_free']       = $data['is_free'] ?? ($data['price'] == 0);

            $course = Course::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Curso creado exitosamente.',
                'data'    => new CourseResource($course->load(['instructor', 'category'])),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el curso.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $course = Course::with([
                'instructor',
                'category',
                'modules.lessons',
                'quizzes',
                'assignments',
            ])->findOrFail($id);

            if (!$course->is_published) {
                $user = auth('sanctum')->user();
                if (!$user || ($user->id !== $course->instructor_id && !$user->isAdmin())) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Curso no encontrado.',
                    ], 404);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Detalle del curso.',
                'data'    => new CourseResource($course),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Curso no encontrado.',
                'error'   => $e->getMessage(),
            ], 404);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $course = Course::findOrFail($id);
            $user   = $request->user();

            if ($course->instructor_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para editar este curso.',
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'title'             => 'sometimes|string|max:255',
                'description'       => 'sometimes|string',
                'short_description' => 'sometimes|string|max:500',
                'price'             => 'sometimes|numeric|min:0',
                'is_free'           => 'sometimes|boolean',
                'category_id'       => 'sometimes|exists:categories,id',
                'level'             => 'sometimes|in:beginner,intermediate,advanced',
                'language'          => 'sometimes|string|max:10',
                'thumbnail'         => 'sometimes|nullable|string',
                'requirements'      => 'sometimes|array',
                'what_you_learn'    => 'sometimes|array',
                'tags'              => 'sometimes|array',
                'certificate_enabled' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos inválidos.',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $data = $validator->validated();
            if (isset($data['title'])) {
                $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
            }

            $course->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Curso actualizado correctamente.',
                'data'    => new CourseResource($course->fresh(['instructor', 'category'])),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el curso.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $course = Course::findOrFail($id);
            $user   = $request->user();

            if ($course->instructor_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para eliminar este curso.',
                ], 403);
            }

            if ($course->enrollments()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes eliminar un curso con estudiantes inscritos.',
                ], 409);
            }

            $course->delete();

            return response()->json([
                'success' => true,
                'message' => 'Curso eliminado correctamente.',
                'data'    => null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el curso.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function publish(Request $request, int $id): JsonResponse
    {
        try {
            $course = Course::findOrFail($id);
            $user   = $request->user();

            if ($course->instructor_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para publicar este curso.',
                ], 403);
            }

            if ($course->modules()->count() === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'El curso debe tener al menos un módulo antes de publicarse.',
                ], 422);
            }

            $course->update([
                'is_published' => !$course->is_published,
                'published_at' => $course->is_published ? null : now(),
            ]);

            $action = $course->is_published ? 'publicado' : 'despublicado';

            return response()->json([
                'success' => true,
                'message' => "Curso {$action} correctamente.",
                'data'    => new CourseResource($course->fresh(['instructor', 'category'])),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar estado del curso.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function enroll(Request $request, int $id): JsonResponse
    {
        try {
            $course = Course::published()->findOrFail($id);
            $user   = $request->user();

            if ($course->isEnrolled($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ya estás inscrito en este curso.',
                ], 409);
            }

            if ($course->max_students && $course->enrollments()->count() >= $course->max_students) {
                return response()->json([
                    'success' => false,
                    'message' => 'El curso ha alcanzado su capacidad máxima.',
                ], 409);
            }

            $enrollment = Enrollment::create([
                'user_id'    => $user->id,
                'course_id'  => $course->id,
                'started_at' => now(),
                'status'     => Enrollment::STATUS_ACTIVE,
                'amount_paid' => $course->is_free ? 0 : $course->price,
            ]);

            $course->increment('enrolled_count');

            // Create enrollment notification
            Notification::create([
                'user_id'    => $user->id,
                'type'       => Notification::TYPE_ENROLLMENT,
                'title'      => '¡Inscripción exitosa!',
                'body'       => "Te has inscrito en el curso: {$course->title}",
                'action_url' => "/courses/{$course->id}",
                'data'       => ['course_id' => $course->id, 'enrollment_id' => $enrollment->id],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Inscripción exitosa.',
                'data'    => [
                    'enrollment_id' => $enrollment->id,
                    'course'        => new CourseResource($course),
                    'started_at'    => $enrollment->started_at,
                ],
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al inscribirse en el curso.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function myCourses(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user->isInstructor() || $user->isAdmin()) {
                $courses = Course::with(['category', 'enrollments'])
                    ->where('instructor_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->paginate(15);
            } else {
                $courses = $user->enrolledCourses()
                    ->with(['instructor', 'category'])
                    ->orderBy('enrollments.created_at', 'desc')
                    ->paginate(15);
            }

            return response()->json([
                'success' => true,
                'message' => 'Mis cursos.',
                'data'    => CourseResource::collection($courses),
                'meta'    => [
                    'current_page' => $courses->currentPage(),
                    'last_page'    => $courses->lastPage(),
                    'total'        => $courses->total(),
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tus cursos.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
