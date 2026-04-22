<?php

namespace App\Actions\Newsletter;

use App\Models\Subscriber;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ConfirmSubscriberAction
{
    public function execute(string $token): Subscriber
    {
        $subscriber = Subscriber::where('token', $token)
            ->where('confirmed', false)
            ->first();

        if (!$subscriber) {
            throw new ModelNotFoundException('Invalid or already used confirmation token.');
        }

        $subscriber->update([
            'confirmed'    => true,
            'confirmed_at' => now(),
            'token'        => null,
        ]);

        return $subscriber;
    }
}
