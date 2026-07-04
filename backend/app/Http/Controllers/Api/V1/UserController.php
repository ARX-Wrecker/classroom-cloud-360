<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password as PasswordRule;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::with('tenant');

            if ($request->filled('role')) {
                $query->where('role', $request->role);
            }
            if ($request->filled('search')) {
                $term = $request->search;
                $query->where(function ($q) use ($term) {
                    $q->where('name', 'ILIKE', "%{$term}%")
                      ->orWhere('email', 'ILIKE', "%{$term}%");
                });
            }
            if ($request->filled('is_active')) {
                $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
            }
            if ($request->filled('tenant_id')) {
                $query->where('tenant_id', $request->tenant_id);
            }

            $perPage = min((int) $request->get('per_page', 20), 100);
            $users   = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Listado de usuarios.',
                'data'    => UserResource::collection($users),
                'meta'    => [
                    'current_page' => $users->currentPage(),
                    'last_page'    => $users->lastPage(),
                    'total'        => $users->total(),
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los usuarios.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'password'  => ['required', PasswordRule::min(8)->letters()->numbers()],
            'role'      => 'required|in:admin,instructor,student',
            'phone'     => 'sometimes|nullable|string|max:20',
            'bio'       => 'sometimes|nullable|string',
            'tenant_id' => 'sometimes|nullable|exists:tenants,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Usuario creado exitosamente.',
                'data'    => new UserResource($user),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el usuario.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $user = User::with(['tenant', 'enrollments.course', 'courses', 'certificates'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Detalle del usuario.',
                'data'    => new UserResource($user),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado.',
                'error'   => $e->getMessage(),
            ], 404);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'sometimes|string|max:255',
            'email'     => "sometimes|email|unique:users,email,{$id}",
            'role'      => 'sometimes|in:admin,instructor,student',
            'phone'     => 'sometimes|nullable|string|max:20',
            'bio'       => 'sometimes|nullable|string',
            'is_active' => 'sometimes|boolean',
            'avatar'    => 'sometimes|nullable|string',
            'tenant_id' => 'sometimes|nullable|exists:tenants,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::findOrFail($id);
            $user->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado correctamente.',
                'data'    => new UserResource($user->fresh()),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el usuario.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            if ($user->role === User::ROLE_SUPERADMIN) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar un superadministrador.',
                ], 403);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado correctamente.',
                'data'    => null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el usuario.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function changeRole(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|in:admin,instructor,student',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Rol inválido.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::findOrFail($id);

            if ($user->role === User::ROLE_SUPERADMIN) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede cambiar el rol de un superadministrador.',
                ], 403);
            }

            $oldRole = $user->role;
            $user->update(['role' => $request->role]);

            return response()->json([
                'success' => true,
                'message' => "Rol cambiado de {$oldRole} a {$request->role}.",
                'data'    => new UserResource($user->fresh()),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar el rol.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function toggleActive(int $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            if ($user->role === User::ROLE_SUPERADMIN) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede desactivar un superadministrador.',
                ], 403);
            }

            $user->update(['is_active' => !$user->is_active]);
            $state = $user->is_active ? 'activado' : 'desactivado';

            return response()->json([
                'success' => true,
                'message' => "Usuario {$state} correctamente.",
                'data'    => new UserResource($user->fresh()),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar el estado del usuario.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
