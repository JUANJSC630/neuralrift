<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;
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
                'name'        => config('site.name'),
                'tagline'     => config('site.tagline'),
                'twitter'     => config('site.twitter'),
                'description' => config('site.description'),
                'url'         => config('site.url'),
                'email'       => config('site.email'),
                'author'      => config('site.author'),
            ],
            'categories' => fn () => Cache::remember('nav_categories', 3600, fn () =>
                Category::orderBy('order')
                    ->withCount(['posts' => fn($q) => $q->published()])
                    ->get(['id', 'name', 'name_en', 'slug', 'color', 'icon', 'posts_count'])
            ),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
