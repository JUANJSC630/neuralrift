<?php

namespace App\Notifications;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostDraftReadyNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly Post $post) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $editUrl = url("/admin/posts/{$this->post->id}/edit");

        return (new MailMessage)
            ->subject("✦ Borrador listo para revisar: {$this->post->title}")
            ->greeting('¡Hola!')
            ->line('Tu borrador generado con IA está listo para revisión.')
            ->line("**Título:** {$this->post->title}")
            ->line("**Tipo:** {$this->post->status}")
            ->action('Revisar borrador en el admin', $editUrl)
            ->line('Recuerda revisar el contenido antes de publicar.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'     => 'ai_generation_success',
            'post_id'  => $this->post->id,
            'title'    => $this->post->title,
            'edit_url' => "/admin/posts/{$this->post->id}/edit",
            'message'  => "Borrador IA listo: {$this->post->title}",
        ];
    }
}
