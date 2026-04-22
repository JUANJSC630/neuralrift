<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Affiliate;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featured = Post::published()
            ->featured()
            ->with(['category', 'author', 'tags'])
            ->latest('published_at')
            ->first();

        $recent = Post::published()
            ->with(['category', 'author'])
            ->when($featured, fn($q) => $q->where('id', '!=', $featured->id))
            ->latest('published_at')
            ->take(6)
            ->get();

        $popular = Post::published()
            ->with(['category'])
            ->orderByDesc('views_count')
            ->take(4)
            ->get(['id', 'title', 'slug', 'cover_image', 'views_count', 'read_time', 'published_at', 'category_id']);

        $affiliates = Affiliate::active()
            ->featured()
            ->orderBy('order')
            ->take(6)
            ->get();

        return Inertia::render('Home', [
            'featured'   => $featured,
            'recent'     => $recent,
            'popular'    => $popular,
            'affiliates' => $affiliates,
        ]);
    }
}
