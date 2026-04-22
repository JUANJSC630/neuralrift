<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostView;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PostViewController extends Controller
{
    public function store(Post $post, Request $request): JsonResponse
    {
        $sessionKey = "viewed_post_{$post->id}";
        if ($request->session()->has($sessionKey)) {
            return response()->json(['counted' => false]);
        }

        PostView::create([
            'post_id'   => $post->id,
            'ip'        => $request->ip(),
            'source'    => $this->detectSource($request->header('Referer')),
            'referrer'  => $request->header('Referer'),
            'viewed_at' => now(),
        ]);

        $post->increment('views_count');
        $request->session()->put($sessionKey, true);

        return response()->json(['counted' => true]);
    }

    private function detectSource(?string $referer): string
    {
        if (!$referer) return 'direct';
        if (str_contains($referer, 'google') || str_contains($referer, 'bing')) return 'organic';
        if (str_contains($referer, 'twitter') || str_contains($referer, 'facebook') ||
            str_contains($referer, 'linkedin') || str_contains($referer, 'instagram')) return 'social';
        return 'referral';
    }
}
