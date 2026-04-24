<?php

namespace App\Mail;

use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Subscriber $subscriber,
    ) {}

    public function envelope(): Envelope
    {
        $name = config('site.name');

        return new Envelope(
            subject: $this->subscriber->lang === 'en'
                ? "Confirm your subscription to {$name}"
                : "Confirma tu suscripción a {$name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.subscription-confirmation',
            text: 'emails.subscription-confirmation-text',
        );
    }
}
