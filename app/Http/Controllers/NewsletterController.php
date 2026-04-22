<?php

namespace App\Http\Controllers;

use App\Actions\Newsletter\ConfirmSubscriberAction;
use App\Actions\Newsletter\SubscribeAction;
use App\Http\Requests\SubscribeNewsletterRequest;
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

            return redirect('/')->with('success', '¡Confirmado! Bienvenido a NeuralRift.');
        } catch (ModelNotFoundException) {
            return redirect('/')->with('error', 'El link no es válido o ya fue usado.');
        }
    }
}
