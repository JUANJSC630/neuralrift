<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function unread(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->unreadNotifications()
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'type' => $n->data['type'] ?? ($n->data['post_id'] ?? null ? 'ai_generation_success' : 'unknown'),
                'message' => $n->data['message'] ?? '',
                'post_id' => $n->data['post_id'] ?? null,
                'edit_url' => $n->data['edit_url'] ?? null,
                'error' => $n->data['error'] ?? null,
                'topic' => $n->data['topic'] ?? null,
                'created_at' => $n->created_at->toIso8601String(),
            ]);

        return response()->json(['notifications' => $notifications]);
    }

    public function markRead(Request $request, string $id): JsonResponse
    {
        $request->user()
            ->unreadNotifications()
            ->where('id', $id)
            ->update(['read_at' => now()]);

        return response()->json(['ok' => true]);
    }
}
