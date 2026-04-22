<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::withCount(['posts' => fn ($q) => $q->published()])
            ->orderBy('order')
            ->get();

        return Inertia::render('Category/Index', [
            'categories' => $categories,
        ]);
    }

    public function show(string $slug): Response
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $posts = $category->posts()
            ->published()
            ->with(['author', 'tags'])
            ->latest('published_at')
            ->paginate(12);

        $featured = $category->posts()
            ->published()
            ->featured()
            ->with(['author'])
            ->latest('published_at')
            ->first();

        return Inertia::render('Category/Show', [
            'category' => $category,
            'posts'    => $posts,
            'featured' => $featured,
        ]);
    }
}
