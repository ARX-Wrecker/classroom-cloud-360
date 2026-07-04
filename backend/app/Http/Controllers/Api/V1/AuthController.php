<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', PasswordRule::min(8)->letters()->mixedCase()->numbers()],
            'role'     => 'sometimes|in:student,instructor',
            'phone'    => 'sometimes|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de registro inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::create([
                'name'      => $request->name,
                'email'     => $request->email,
                'password'  => $request->password,
                'role'      => $request->role ?? User::ROLE_STUDENT,
                'phone'     => $request->phone,
                'is_active' => true,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Usuario registrado exitosamente.',
                'data'    => [
                    'user'         => new UserResource($user),
                    'access_token' => $token,
                    'token_type'   => 'Bearer',
                ],
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar el usuario.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales inválidas.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email o contraseña incorrectos.',
                ], 401);
            }

            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tu cuenta está desactivada. Contacta al administrador.',
                ], 403);
            }

            // Revoke previous tokens
            $user->tokens()->delete();

            $token = $user->createToken('auth_token')->plainTextToken;

            $user->update(['last_login_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Inicio de sesión exitoso.',
                'data'    => [
                    'user'         => new UserResource($user),
                    'access_token' => $token,
                    'token_type'   => 'Bearer',
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al iniciar sesión.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sesión cerrada correctamente.',
                'data'    => null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cerrar sesión.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user()->load(['tenant', 'enrollments.course', 'certificates']);

            return response()->json([
                'success' => true,
                'message' => 'Perfil del usuario autenticado.',
                'data'    => new UserResource($user),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el perfil.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function refreshToken(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->tokens()->delete();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Token renovado.',
                'data'    => [
                    'access_token' => $token,
                    'token_type'   => 'Bearer',
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al renovar el token.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email inválido o no registrado.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $status = Password::sendResetLink($request->only('email'));

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'success' => true,
                    'message' => 'Se ha enviado un enlace de recuperación a tu email.',
                    'data'    => null,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No se pudo enviar el email de recuperación.',
            ], 400);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'token'    => 'required|string',
            'email'    => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::min(8)->letters()->mixedCase()->numbers()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function (User $user, string $password) {
                    $user->forceFill(['password' => $password])->save();
                    $user->tokens()->delete();
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return response()->json([
                    'success' => true,
                    'message' => 'Contraseña restablecida correctamente.',
                    'data'    => null,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Token inválido o expirado.',
            ], 400);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al restablecer la contraseña.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'  => 'sometimes|string|max:255',
            'bio'   => 'sometimes|nullable|string|max:1000',
            'phone' => 'sometimes|nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $user = $request->user();
            $user->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Perfil actualizado.',
                'data'    => new UserResource($user->fresh()),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el perfil.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
