<?php

namespace App\Jobs;

use App\Actions\AI\CreatePostFromGeneratedContentAction;
use App\AI\Agents\PostGeneratorAgent;
use App\Models\User;
use App\Notifications\PostDraftFailedNotification;
use App\Notifications\PostDraftReadyNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Sentry\State\Scope;

class GeneratePostDraftJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 360;

    public int $tries = 1;

    public function __construct(
        private readonly array $inputs,
        private readonly int $authorId,
    ) {
        $this->onQueue('ai-generation');
    }

    public function handle(
        PostGeneratorAgent $agent,
        CreatePostFromGeneratedContentAction $createAction,
    ): void {
        $cacheKey = "ai_job:user:{$this->authorId}";

        // Mark as running so the frontend banner updates
        if ($existing = Cache::get($cacheKey)) {
            Cache::put($cacheKey, array_merge($existing, ['status' => 'running']), 600);
        }

        try {
            Log::info('GeneratePostDraftJob: starting', [
                'type' => $this->inputs['post_type'],
                'topic' => substr($this->inputs['topic'], 0, 80),
            ]);

            $dto = $agent->generate($this->inputs);
            $post = $createAction->execute($dto, $this->authorId);

            // Clear job status — banner will disappear
            Cache::forget($cacheKey);

            $author = User::find($this->authorId);
            if ($author) {
                $author->notify(new PostDraftReadyNotification($post));
            }

            Log::info('GeneratePostDraftJob: completed', [
                'post_id' => $post->id,
                'title' => $post->title,
            ]);
        } catch (\Throwable $e) {
            Log::error('GeneratePostDraftJob: failed', [
                'error' => $e->getMessage(),
                'inputs' => $this->inputs,
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('GeneratePostDraftJob: all attempts failed', [
            'error' => $exception->getMessage(),
            'inputs' => $this->inputs,
        ]);

        // Write failed status so the banner shows the error (TTL 5 min)
        Cache::put("ai_job:user:{$this->authorId}", [
            'status' => 'failed',
            'topic' => substr($this->inputs['topic'] ?? '', 0, 120),
            'type' => $this->inputs['post_type'] ?? 'unknown',
            'started_at' => now()->toIso8601String(),
            'error' => substr($exception->getMessage(), 0, 200),
        ], 300);

        \Sentry\withScope(function (Scope $scope) use ($exception): void {
            $scope->setContext('job', [
                'type' => $this->inputs['post_type'] ?? 'unknown',
                'topic' => substr($this->inputs['topic'] ?? '', 0, 100),
            ]);
            \Sentry\captureException($exception);
        });

        $author = User::find($this->authorId);
        if ($author) {
            $author->notify(new PostDraftFailedNotification(
                topic: $this->inputs['topic'] ?? 'Sin tema',
                error: $exception->getMessage(),
            ));
        }
    }
}
