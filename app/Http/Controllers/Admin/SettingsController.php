<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Settings', [
            'settings' => [
                'site_name' => config('app.name'),
                'site_description' => config('site.description'),
                'twitter' => config('site.twitter'),
                'analytics_id' => config('site.analytics_id'),
            ],
            'user' => auth()->user(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        foreach (['linkedin', 'website'] as $field) {
            $value = $request->input($field);
            if ($value && ! preg_match('#^https?://#i', $value)) {
                $request->merge([$field => 'https://'.$value]);
            }
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string|max:500',
            'twitter' => 'nullable|string|max:50',
            'linkedin' => 'nullable|url',
            'website' => 'nullable|url',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:50',
        ]);

        auth()->user()->update($request->only([
            'name', 'bio', 'twitter', 'linkedin', 'website', 'skills',
        ]));

        return back()->with('success', 'Ajustes guardados.');
    }
}
