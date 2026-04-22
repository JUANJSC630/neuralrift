<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        Subscriber::firstOrCreate(
            ['email' => $request->email],
            ['confirmed' => false]
        );

        return back()->with('success', '¡Suscrito! Revisa tu email.');
    }

    public function confirm(string $token)
    {
        $subscriber = Subscriber::where('token', $token)->firstOrFail();
        $subscriber->update([
            'confirmed'    => true,
            'confirmed_at' => now(),
            'token'        => null,
        ]);

        return redirect('/')->with('success', '¡Email confirmado! Bienvenido a NeuralRift.');
    }
}
