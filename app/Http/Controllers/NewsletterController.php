<?php

namespace App\Http\Controllers;

use App\Actions\Newsletter\ConfirmSubscriberAction;
use App\Actions\Newsletter\SubscribeAction;
use App\Http\Requests\SubscribeNewsletterRequest;
use App\Models\Subscriber;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;

class NewsletterController extends Controller
{
    public function __construct(
        private readonly SubscribeAction $subscribeAction,
        private readonly ConfirmSubscriberAction $confirmAction,
    ) {}

    public function subscribe(SubscribeNewsletterRequest $request): RedirectResponse
    {
        $this->subscribeAction->execute(
            $request->validated('email'),
            $request->validated('lang', 'es'),
        );

        return back()->with('success', 'Revisa tu email para confirmar tu suscripción.');
    }

    public function confirm(string $token): RedirectResponse
    {
        try {
            $this->confirmAction->execute($token);

            return redirect('/')->with('success', '¡Confirmado! Bienvenido a ' . config('site.name') . '.');
        } catch (ModelNotFoundException) {
            return redirect('/')->with('error', 'El link no es válido o ya fue usado.');
        }
    }

    public function unsubscribe(string $token): RedirectResponse
    {
        $subscriber = Subscriber::where('unsubscribe_token', $token)->first();

        if (!$subscriber) {
            return redirect('/')->with('error', 'El link de cancelación no es válido.');
        }

        $subscriber->delete();

        return redirect('/')->with('success', 'Te has dado de baja correctamente. ¡Hasta pronto!');
    }
}
