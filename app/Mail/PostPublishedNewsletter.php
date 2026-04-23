<?php

namespace App\Mail;

use App\Models\Post;
use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PostPublishedNewsletter extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Post $post,
        public readonly Subscriber $subscriber,
    ) {}

    public function envelope(): Envelope
    {
        $isEn = $this->subscriber->lang === 'en';
        $title = $isEn && $this->post->title_en ? $this->post->title_en : $this->post->title;

        return new Envelope(
            subject: $isEn
                ? "New post: {$title}"
                : "Nuevo artículo: {$title}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.post-published',
            text: 'emails.post-published-text',
        );
    }
}
