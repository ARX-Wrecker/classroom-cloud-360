<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user  = $request->user();
            $query = Notification::where('user_id', $user->id);

            if ($request->boolean('unread')) {
                $query->unread();
            }

            $notifications = $query->orderBy('created_at', 'desc')->paginate(20);
            $unreadCount   = Notification::where('user_id', $user->id)->unread()->count();

            return response()->json([
                'success' => true,
                'message' => 'Notificaciones.',
                'data'    => $notifications->items(),
                'meta'    => [
                    'current_page' => $notifications->currentPage(),
                    'last_page'    => $notifications->lastPage(),
                    'total'        => $notifications->total(),
                    'unread_count' => $unreadCount,
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las notificaciones.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function markRead(Request $request, int $id): JsonResponse
    {
        try {
            $notification = Notification::where('user_id', $request->user()->id)
                ->findOrFail($id);

            $notification->markAsRead();

            return response()->json([
                'success' => true,
                'message' => 'Notificación marcada como leída.',
                'data'    => $notification,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al marcar la notificación.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function markAllRead(Request $request): JsonResponse
    {
        try {
            Notification::where('user_id', $request->user()->id)
                ->unread()
                ->update(['read_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Todas las notificaciones marcadas como leídas.',
                'data'    => null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al marcar las notificaciones.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $notification = Notification::where('user_id', $request->user()->id)->findOrFail($id);
            $notification->delete();

            return response()->json([
                'success' => true,
                'message' => 'Notificación eliminada.',
                'data'    => null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la notificación.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
