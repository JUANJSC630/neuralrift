<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PostDraftFailedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $topic,
        private readonly string $error,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'ai_generation_failed',
            'topic' => $this->topic,
            'error' => $this->error,
            'message' => "Error al generar borrador IA: {$this->truncatedError()}",
        ];
    }

    private function truncatedError(): string
    {
        $clean = str_replace(["\n", "\r"], ' ', $this->error);

        return mb_strlen($clean) > 120 ? mb_substr($clean, 0, 120).'…' : $clean;
    }
}
