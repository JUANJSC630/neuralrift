<?php

namespace App\Jobs;

use App\Mail\PostPublishedNewsletter;
use App\Models\Post;
use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendPostNewsletterJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public string $queue = 'newsletter';

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public readonly Post $post,
    ) {}

    public function failed(\Throwable $exception): void
    {
        \Sentry\withScope(function (\Sentry\State\Scope $scope) use ($exception): void {
            $scope->setContext('job', [
                'post_id' => $this->post->id,
                'post'    => $this->post->title,
            ]);
            \Sentry\captureException($exception);
        });
    }

    public function handle(): void
    {
        $postLang = $this->post->lang ?? 'es';

        $query = Subscriber::where('confirmed', true);

        if ($postLang !== 'both') {
            $query->where(function ($q) use ($postLang) {
                $q->where('lang', $postLang)
                    ->orWhereNull('lang');
            });
        }

        $query->cursor()
            ->each(function (Subscriber $subscriber) {
                Mail::to($subscriber->email)
                    ->queue(new PostPublishedNewsletter($this->post, $subscriber));
            });
    }
}
