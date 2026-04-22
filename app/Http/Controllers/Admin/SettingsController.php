<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Settings', [
            'settings' => [
                'site_name'        => config('app.name'),
                'site_description' => env('SITE_DESCRIPTION', ''),
                'twitter'          => env('SITE_TWITTER', '@neuralrift'),
                'analytics_id'     => env('ANALYTICS_ID', ''),
            ],
            'user' => auth()->user(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        foreach (['linkedin', 'website'] as $field) {
            $value = $request->input($field);
            if ($value && ! preg_match('#^https?://#i', $value)) {
                $request->merge([$field => 'https://' . $value]);
            }
        }

        $request->validate([
            'name'     => 'required|string|max:255',
            'bio'      => 'nullable|string|max:500',
            'twitter'  => 'nullable|string|max:50',
            'linkedin' => 'nullable|url',
            'website'  => 'nullable|url',
        ]);

        auth()->user()->update($request->only([
            'name', 'bio', 'twitter', 'linkedin', 'website',
        ]));

        return back()->with('success', 'Ajustes guardados.');
    }
}
