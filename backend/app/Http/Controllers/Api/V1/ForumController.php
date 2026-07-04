<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\ForumPost;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ForumController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'course_id' => 'required|exists:courses,id',
                'type'      => 'sometimes|in:discussion,question,reply',
                'lesson_id' => 'sometimes|exists:lessons,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos inválidos.',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $query = ForumPost::with(['user', 'replies.user'])
                ->topLevel()
                ->forCourse($request->course_id);

            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }
            if ($request->filled('lesson_id')) {
                $query->where('lesson_id', $request->lesson_id);
            }

            $posts = $query->orderByDesc('is_pinned')
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return response()->json([
                'success' => true,
                'message' => 'Posts del foro.',
                'data'    => $posts->items(),
                'meta'    => [
                    'current_page' => $posts->currentPage(),
                    'last_page'    => $posts->lastPage(),
                    'total'        => $posts->total(),
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los posts.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'module_id' => 'sometimes|nullable|exists:modules,id',
            'lesson_id' => 'sometimes|nullable|exists:lessons,id',
            'parent_id' => 'sometimes|nullable|exists:forum_posts,id',
            'title'     => 'sometimes|string|max:255',
            'body'      => 'required|string',
            'type'      => 'required|in:discussion,question,reply',
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

            // Must be enrolled or instructor or admin
            $isEnrolled   = Enrollment::where('user_id', $user->id)->where('course_id', $request->course_id)->exists();
            $isInstructor = \App\Models\Course::where('id', $request->course_id)->where('instructor_id', $user->id)->exists();

            if (!$isEnrolled && !$isInstructor && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Debes estar inscrito en el curso para participar en el foro.',
                ], 403);
            }

            $data            = $validator->validated();
            $data['user_id'] = $user->id;

            $post = ForumPost::create($data);

            // If it's a reply, update parent's replies_count and notify parent author
            if ($request->parent_id) {
                $parent = ForumPost::find($request->parent_id);
                if ($parent) {
                    $parent->increment('replies_count');

                    if ($parent->user_id !== $user->id) {
                        Notification::create([
                            'user_id'    => $parent->user_id,
                            'type'       => Notification::TYPE_FORUM_REPLY,
                            'title'      => $user->name . ' respondió tu post',
                            'body'       => substr($request->body, 0, 100),
                            'action_url' => "/forum/{$parent->id}",
                            'data'       => ['post_id' => $post->id, 'parent_id' => $parent->id],
                        ]);
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Post publicado correctamente.',
                'data'    => $post->load('user'),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al publicar el post.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $post = ForumPost::with(['user', 'replies.user', 'course'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Detalle del post.',
                'data'    => $post,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Post no encontrado.',
                'error'   => $e->getMessage(),
            ], 404);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'sometimes|string|max:255',
            'body'        => 'sometimes|string',
            'is_pinned'   => 'sometimes|boolean',
            'is_answered' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $post = ForumPost::findOrFail($id);
            $user = $request->user();

            // Only author or admin can edit; only admin/instructor can pin
            if ($post->user_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para editar este post.',
                ], 403);
            }

            if (isset($request->is_pinned) && !$user->isAdmin() && !$user->isInstructor()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo instructores o admins pueden fijar posts.',
                ], 403);
            }

            $post->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Post actualizado correctamente.',
                'data'    => $post->fresh('user'),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el post.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $post = ForumPost::findOrFail($id);
            $user = $request->user();

            if ($post->user_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para eliminar este post.',
                ], 403);
            }

            // Update parent replies_count if it's a reply
            if ($post->parent_id) {
                ForumPost::find($post->parent_id)?->decrement('replies_count');
            }

            $post->delete();

            return response()->json([
                'success' => true,
                'message' => 'Post eliminado correctamente.',
                'data'    => null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el post.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
