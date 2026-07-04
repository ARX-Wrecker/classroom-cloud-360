<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user         = $request->user();
            $certificates = Certificate::with(['course', 'course.instructor'])
                ->where('user_id', $user->id)
                ->orderBy('issued_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Mis certificados.',
                'data'    => CertificateResource::collection($certificates),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los certificados.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function generate(Request $request, int $enrollmentId): JsonResponse
    {
        try {
            $enrollment = Enrollment::with(['user', 'course'])->findOrFail($enrollmentId);
            $user       = $request->user();

            // Only the student themselves or admin can generate
            if ($enrollment->user_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para generar este certificado.',
                ], 403);
            }

            if (!$enrollment->isCompleted()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Debes completar el 100% del curso para obtener el certificado.',
                    'data'    => ['progress' => $enrollment->progress],
                ], 422);
            }

            if (!$enrollment->course->certificate_enabled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este curso no tiene certificados habilitados.',
                ], 422);
            }

            // Check if certificate already exists
            $existing = Certificate::where('enrollment_id', $enrollmentId)->first();
            if ($existing) {
                return response()->json([
                    'success' => true,
                    'message' => 'El certificado ya fue generado anteriormente.',
                    'data'    => new CertificateResource($existing->load('course')),
                ]);
            }

            $certificate = Certificate::create([
                'user_id'       => $enrollment->user_id,
                'course_id'     => $enrollment->course_id,
                'enrollment_id' => $enrollment->id,
                'issued_at'     => now(),
                'metadata'      => [
                    'student_name'    => $enrollment->user->name,
                    'course_title'    => $enrollment->course->title,
                    'instructor_name' => $enrollment->course->instructor->name ?? 'N/A',
                    'duration_hours'  => $enrollment->course->duration_hours,
                    'completed_at'    => $enrollment->completed_at?->toDateString(),
                ],
            ]);

            // Notify student
            Notification::create([
                'user_id'    => $enrollment->user_id,
                'type'       => Notification::TYPE_CERTIFICATE,
                'title'      => '¡Certificado disponible!',
                'body'       => "Tu certificado del curso \"{$enrollment->course->title}\" está listo.",
                'action_url' => "/certificates/{$certificate->id}",
                'data'       => ['certificate_id' => $certificate->id],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Certificado generado exitosamente.',
                'data'    => new CertificateResource($certificate->load('course')),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el certificado.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function verify(string $code): JsonResponse
    {
        try {
            $certificate = Certificate::with(['user', 'course', 'course.instructor'])
                ->where('verification_code', strtoupper($code))
                ->first();

            if (!$certificate) {
                return response()->json([
                    'success' => false,
                    'message' => 'Certificado no encontrado o código inválido.',
                    'data'    => ['valid' => false],
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Certificado verificado.',
                'data'    => [
                    'valid'           => $certificate->isValid(),
                    'student_name'    => $certificate->user->name,
                    'course_title'    => $certificate->course->title,
                    'instructor_name' => $certificate->course->instructor->name ?? 'N/A',
                    'issued_at'       => $certificate->issued_at->toDateString(),
                    'expires_at'      => $certificate->expires_at?->toDateString(),
                    'verification_code' => $certificate->verification_code,
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al verificar el certificado.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $certificate = Certificate::with(['user', 'course', 'course.instructor'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Detalle del certificado.',
                'data'    => new CertificateResource($certificate),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Certificado no encontrado.',
                'error'   => $e->getMessage(),
            ], 404);
        }
    }
}
