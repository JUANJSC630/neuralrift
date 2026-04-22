<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Category;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'locale' => fn () => app()->getLocale(),
            'site' => [
                'name'        => 'NeuralRift',
                'tagline'     => 'El futuro de la IA empieza aquí',
                'twitter'     => '@neuralrift',
                'description' => 'Guías en profundidad, reviews honestas y estrategias para navegar la revolución de la IA.',
            ],
            'categories' => fn () => Category::orderBy('order')
                ->withCount(['posts' => fn($q) => $q->published()])
                ->get(['id', 'name', 'name_en', 'slug', 'color', 'icon', 'posts_count']),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
