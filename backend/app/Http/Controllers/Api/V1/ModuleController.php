<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ModuleResource;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ModuleController extends Controller
{
    public function index(int $courseId): JsonResponse
    {
        try {
            $course  = Course::findOrFail($courseId);
            $modules = $course->modules()->with('lessons')->get();

            return response()->json([
                'success' => true,
                'message' => 'Módulos del curso.',
                'data'    => ModuleResource::collection($modules),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener módulos.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request, int $courseId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'description' => 'sometimes|string',
            'order'       => 'sometimes|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $course = Course::findOrFail($courseId);
            $user   = $request->user();

            if ($course->instructor_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para agregar módulos a este curso.',
                ], 403);
            }

            $data            = $validator->validated();
            $data['course_id'] = $course->id;
            if (!isset($data['order'])) {
                $data['order'] = $course->modules()->max('order') + 1;
            }

            $module = Module::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Módulo creado correctamente.',
                'data'    => new ModuleResource($module),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el módulo.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $courseId, int $moduleId): JsonResponse
    {
        try {
            $module = Module::with('lessons')
                ->where('course_id', $courseId)
                ->findOrFail($moduleId);

            return response()->json([
                'success' => true,
                'message' => 'Detalle del módulo.',
                'data'    => new ModuleResource($module),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo no encontrado.',
                'error'   => $e->getMessage(),
            ], 404);
        }
    }

    public function update(Request $request, int $courseId, int $moduleId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'        => 'sometimes|string|max:255',
            'description'  => 'sometimes|string',
            'order'        => 'sometimes|integer|min:0',
            'is_published' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $module = Module::where('course_id', $courseId)->findOrFail($moduleId);
            $user   = $request->user();

            if ($module->course->instructor_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para editar este módulo.',
                ], 403);
            }

            $module->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Módulo actualizado correctamente.',
                'data'    => new ModuleResource($module->fresh('lessons')),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el módulo.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, int $courseId, int $moduleId): JsonResponse
    {
        try {
            $module = Module::where('course_id', $courseId)->findOrFail($moduleId);
            $user   = $request->user();

            if ($module->course->instructor_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para eliminar este módulo.',
                ], 403);
            }

            $module->delete();

            return response()->json([
                'success' => true,
                'message' => 'Módulo eliminado correctamente.',
                'data'    => null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el módulo.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
