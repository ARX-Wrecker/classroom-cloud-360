<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user  = $request->user();
            $query = Document::with('uploader');

            if ($user->isStudent()) {
                $query->where(function ($q) use ($user) {
                    $q->where('is_public', true)
                      ->orWhere('user_id', $user->id);
                });
            } elseif ($user->isInstructor()) {
                $query->whereHas('course', fn($q) => $q->where('instructor_id', $user->id))
                      ->orWhere('user_id', $user->id);
            }

            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            if ($request->filled('course_id')) {
                $query->where('course_id', $request->course_id);
            }

            $documents = $query->orderBy('created_at', 'desc')->paginate(20);

            return response()->json([
                'success' => true,
                'data'    => $documents->map(fn($d) => [
                    'id'         => $d->id,
                    'name'       => $d->name,
                    'type'       => $d->type,
                    'size'       => $d->size,
                    'size_label' => $d->size_label,
                    'url'        => Storage::url($d->file_path),
                    'course'     => $d->course_id ? ['id' => $d->course_id, 'title' => $d->course?->title] : null,
                    'is_public'  => $d->is_public,
                    'uploader'   => ['name' => $d->uploader?->name],
                    'created_at' => $d->created_at,
                ]),
            ]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file'      => 'required|file|max:51200',
            'name'      => 'nullable|string|max:255',
            'course_id' => 'nullable|exists:courses,id',
            'is_public' => 'nullable|boolean',
        ]);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $file = $request->file('file');

        $path = $file->store("documents/{$user->id}", 'public');
        $ext  = strtolower($file->getClientOriginalExtension());
        $type = match(true) {
            in_array($ext, ['pdf'])              => 'pdf',
            in_array($ext, ['ppt','pptx'])       => 'presentation',
            in_array($ext, ['doc','docx'])        => 'document',
            in_array($ext, ['xls','xlsx','csv']) => 'spreadsheet',
            in_array($ext, ['mp4','mov','avi'])  => 'video',
            in_array($ext, ['jpg','jpeg','png','gif','webp']) => 'image',
            default                              => 'file',
        };

        $document = Document::create([
            'user_id'   => $user->id,
            'course_id' => $request->course_id,
            'name'      => $request->name ?? $file->getClientOriginalName(),
            'file_path' => $path,
            'type'      => $type,
            'size'      => $file->getSize(),
            'is_public' => $request->boolean('is_public', false),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Documento subido exitosamente.',
            'data'    => ['id' => $document->id, 'url' => Storage::url($path)],
        ], 201);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $document = Document::findOrFail($id);
        if ($document->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Sin permisos.'], 403);
        }
        Storage::disk('public')->delete($document->file_path);
        $document->delete();
        return response()->json(['success' => true, 'message' => 'Documento eliminado.']);
    }
}
