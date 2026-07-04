<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $categories = Category::withCount('courses')
                ->where('is_active', true)
                ->whereNull('parent_id')
                ->with('children')
                ->orderBy('order')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Categorías.',
                'data'    => $categories,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las categorías.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|max:255',
            'description' => 'sometimes|string',
            'icon'      => 'sometimes|nullable|string',
            'color'     => 'sometimes|nullable|string|max:7',
            'parent_id' => 'sometimes|nullable|exists:categories,id',
            'order'     => 'sometimes|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $data         = $validator->validated();
            $data['slug'] = Str::slug($data['name']);
            $data['tenant_id'] = $request->user()->tenant_id;

            $category = Category::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Categoría creada correctamente.',
                'data'    => $category,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la categoría.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $category = Category::withCount('courses')->with(['children', 'courses'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Detalle de la categoría.',
                'data'    => $category,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada.',
                'error'   => $e->getMessage(),
            ], 404);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'icon'        => 'sometimes|nullable|string',
            'color'       => 'sometimes|nullable|string|max:7',
            'is_active'   => 'sometimes|boolean',
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
            $category = Category::findOrFail($id);
            $data     = $validator->validated();
            if (isset($data['name'])) {
                $data['slug'] = Str::slug($data['name']);
            }
            $category->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Categoría actualizada correctamente.',
                'data'    => $category->fresh(),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la categoría.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $category = Category::findOrFail($id);

            if ($category->courses()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar una categoría con cursos asociados.',
                ], 409);
            }

            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Categoría eliminada correctamente.',
                'data'    => null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la categoría.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
