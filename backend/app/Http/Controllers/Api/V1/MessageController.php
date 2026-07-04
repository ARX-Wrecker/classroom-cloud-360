<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user  = $request->user();
            $type  = $request->get('type', 'inbox'); // inbox | sent

            $query = Message::with(['sender', 'receiver'])
                ->whereNull('parent_id'); // Only top-level messages

            if ($type === 'sent') {
                $query->where('sender_id', $user->id);
            } else {
                $query->where('receiver_id', $user->id);
            }

            $messages    = $query->orderBy('created_at', 'desc')->paginate(20);
            $unreadCount = Message::where('receiver_id', $user->id)->whereNull('read_at')->count();

            return response()->json([
                'success' => true,
                'message' => 'Mensajes.',
                'data'    => $messages->items(),
                'meta'    => [
                    'current_page' => $messages->currentPage(),
                    'last_page'    => $messages->lastPage(),
                    'total'        => $messages->total(),
                    'unread_count' => $unreadCount,
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los mensajes.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|exists:users,id',
            'subject'     => 'sometimes|string|max:255',
            'body'        => 'required|string',
            'parent_id'   => 'sometimes|nullable|exists:messages,id',
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

            if ($request->receiver_id == $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes enviarte mensajes a ti mismo.',
                ], 422);
            }

            $message = Message::create([
                'sender_id'   => $user->id,
                'receiver_id' => $request->receiver_id,
                'subject'     => $request->subject,
                'body'        => $request->body,
                'parent_id'   => $request->parent_id,
            ]);

            // Notify receiver
            Notification::create([
                'user_id'    => $request->receiver_id,
                'type'       => Notification::TYPE_MESSAGE,
                'title'      => 'Nuevo mensaje de ' . $user->name,
                'body'       => substr($request->body, 0, 100),
                'action_url' => "/messages/{$message->id}",
                'data'       => ['message_id' => $message->id, 'sender_id' => $user->id],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Mensaje enviado correctamente.',
                'data'    => $message->load(['sender', 'receiver']),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el mensaje.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $user    = $request->user();
            $message = Message::with(['sender', 'receiver', 'replies.sender'])
                ->where(function ($q) use ($user) {
                    $q->where('sender_id', $user->id)->orWhere('receiver_id', $user->id);
                })
                ->findOrFail($id);

            // Mark as read if receiver
            if ($message->receiver_id === $user->id) {
                $message->markAsRead();
            }

            return response()->json([
                'success' => true,
                'message' => 'Detalle del mensaje.',
                'data'    => $message,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Mensaje no encontrado.',
                'error'   => $e->getMessage(),
            ], 404);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $user    = $request->user();
            $message = Message::where('sender_id', $user->id)->findOrFail($id);
            $message->delete();

            return response()->json([
                'success' => true,
                'message' => 'Mensaje eliminado.',
                'data'    => null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el mensaje.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
