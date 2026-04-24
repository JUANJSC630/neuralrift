<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostLikeController extends Controller
{
    public function like(Post $post, Request $request): JsonResponse
    {
        $post->increment('likes_count');

        return response()->json([
            'likes_count' => $post->fresh()->likes_count,
        ]);
    }

    public function unlike(Post $post, Request $request): JsonResponse
    {
        $post->decrement('likes_count');

        return response()->json([
            'likes_count' => max(0, $post->fresh()->likes_count),
        ]);
    }
}
