<?php

namespace App\Actions\Analytics;

use App\Models\Post;
use App\Models\PostView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RecordPostViewAction
{
    private const BOT_PATTERNS = [
        'googlebot', 'bingbot', 'spider', 'crawler', 'slurp',
        'duckduckbot', 'baiduspider', 'yandexbot', 'facebot',
        'ia_archiver', 'semrushbot', 'ahrefsbot',
    ];

    public function execute(Post $post, Request $request): bool
    {
        $sessionKey = "viewed_post_{$post->id}";

        if ($request->session()->has($sessionKey)) {
            return false;
        }

        if ($this->isBot($request->userAgent())) {
            return false;
        }

        try {
            PostView::create([
                'post_id' => $post->id,
                'ip' => $request->ip(),
                'source' => $this->detectSource($request->header('Referer')),
                'referrer' => $request->header('Referer'),
                'viewed_at' => now(),
            ]);

            $post->increment('views_count');
            $request->session()->put($sessionKey, true);

            return true;
        } catch (\Throwable $e) {
            Log::warning('Failed to record post view', [
                'post_id' => $post->id,
                'error' => $e->getMessage(),
            ]);

            \Sentry\captureException($e);

            return false;
        }
    }

    private function isBot(?string $userAgent): bool
    {
        if (! $userAgent) {
            return true;
        }

        $ua = strtolower($userAgent);

        foreach (self::BOT_PATTERNS as $pattern) {
            if (str_contains($ua, $pattern)) {
                return true;
            }
        }

        return false;
    }

    private function detectSource(?string $referer): string
    {
        if (! $referer) {
            return 'direct';
        }

        if (str_contains($referer, 'google') || str_contains($referer, 'bing')) {
            return 'organic';
        }

        if (str_contains($referer, 'twitter') || str_contains($referer, 'facebook')
            || str_contains($referer, 'linkedin') || str_contains($referer, 'instagram')) {
            return 'social';
        }

        return 'referral';
    }
}
