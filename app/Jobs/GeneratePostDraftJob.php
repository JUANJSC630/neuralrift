<?php

namespace App\Jobs;

use App\AI\Agents\PostGeneratorAgent;
use App\Actions\AI\CreatePostFromGeneratedContentAction;
use App\Models\User;
use App\Notifications\PostDraftFailedNotification;
use App\Notifications\PostDraftReadyNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GeneratePostDraftJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;
    public int $tries   = 2;
    public int $backoff = 30;

    public function __construct(
        private readonly array $inputs,
        private readonly int   $authorId,
    ) {}

    public function handle(
        PostGeneratorAgent                   $agent,
        CreatePostFromGeneratedContentAction $createAction,
    ): void {
        try {
            Log::info('GeneratePostDraftJob: starting', [
                'type'  => $this->inputs['post_type'],
                'topic' => substr($this->inputs['topic'], 0, 80),
            ]);

            $dto  = $agent->generate($this->inputs);
            $post = $createAction->execute($dto, $this->authorId);

            $author = User::find($this->authorId);
            if ($author) {
                $author->notify(new PostDraftReadyNotification($post));
            }

            Log::info('GeneratePostDraftJob: completed', [
                'post_id' => $post->id,
                'title'   => $post->title,
            ]);
        } catch (\Throwable $e) {
            Log::error('GeneratePostDraftJob: failed', [
                'error'  => $e->getMessage(),
                'inputs' => $this->inputs,
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('GeneratePostDraftJob: all attempts failed', [
            'error'  => $exception->getMessage(),
            'inputs' => $this->inputs,
        ]);

        $author = User::find($this->authorId);
        if ($author) {
            $author->notify(new PostDraftFailedNotification(
                topic: $this->inputs['topic'] ?? 'Sin tema',
                error: $exception->getMessage(),
            ));
        }
    }
}
