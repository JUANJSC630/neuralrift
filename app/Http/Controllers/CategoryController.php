<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
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
            'canonical'  => url(app()->getLocale() === 'en' ? '/en/categories' : '/categorias'),
        ]);
    }

    public function show(string $slug): Response
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        $lang = app()->getLocale();

        $posts = Post::query()
            ->where('category_id', $category->id)
            ->published()
            ->forLang($lang)
            ->with(['author', 'tags'])
            ->latest('published_at')
            ->paginate(12);

        $featured = Post::query()
            ->where('category_id', $category->id)
            ->published()
            ->forLang($lang)
            ->featured()
            ->with(['author'])
            ->latest('published_at')
            ->first();

        return Inertia::render('Category/Show', [
            'category'  => $category,
            'posts'     => $posts,
            'featured'  => $featured,
            'canonical' => url($lang === 'en' ? "/en/category/{$category->slug}" : "/categoria/{$category->slug}"),
        ]);
    }
}
