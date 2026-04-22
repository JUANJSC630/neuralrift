<?php

namespace App\Actions\Newsletter;

use App\Mail\SubscriptionConfirmation;
use App\Models\Subscriber;
use Illuminate\Support\Facades\Mail;

class SubscribeAction
{
    public function execute(string $email, string $lang = 'es'): Subscriber
    {
        $subscriber = Subscriber::firstOrCreate(
            ['email' => $email],
            ['confirmed' => false, 'lang' => $lang],
        );

        if (!$subscriber->confirmed) {
            Mail::to($subscriber->email)->send(new SubscriptionConfirmation($subscriber));
        }

        return $subscriber;
    }
}
