<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Post::published()
            ->with(['category', 'author', 'tags'])
            ->forLang('es');

        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }
        if ($request->tag) {
            $query->whereHas('tags', fn($q) => $q->where('slug', $request->tag));
        }
        if ($request->search) {
            $query->where(fn($q) => $q
                ->where('title', 'like', "%{$request->search}%")
                ->orWhere('excerpt', 'like', "%{$request->search}%")
            );
        }

        match($request->sort ?? 'recent') {
            'popular'  => $query->orderByDesc('views_count'),
            'shortest' => $query->orderBy('read_time'),
            default    => $query->latest('published_at'),
        };

        $posts = $query->paginate(12)->withQueryString();

        return Inertia::render('Blog/Index', [
            'posts'   => $posts,
            'filters' => $request->only(['category', 'tag', 'search', 'sort']),
            'lang'    => 'es',
        ]);
    }

    public function show(string $slug): Response
    {
        $post = Post::published()
            ->where('slug', $slug)
            ->with(['category', 'author', 'tags', 'affiliates'])
            ->firstOrFail();

        $related = Post::published()
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->with(['category', 'author'])
            ->latest('published_at')
            ->take(3)
            ->get();

        $post->increment('views_count');

        $schema = [
            '@context'      => 'https://schema.org',
            '@type'         => 'BlogPosting',
            'headline'      => $post->title,
            'description'   => $post->excerpt,
            'datePublished' => $post->published_at?->toIso8601String(),
            'dateModified'  => $post->updated_at->toIso8601String(),
            'author'        => [
                '@type' => 'Person',
                'name'  => $post->author->name,
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name'  => 'NeuralRift',
            ],
        ];

        return Inertia::render('Blog/Show', [
            'post'    => $post,
            'related' => $related,
            'schema'  => $schema,
        ]);
    }

    public function indexEn(Request $request): Response
    {
        $query = Post::published()
            ->with(['category', 'author', 'tags'])
            ->forLang('en');

        if ($request->search) {
            $query->where(fn($q) => $q
                ->where('title_en', 'like', "%{$request->search}%")
                ->orWhere('title',   'like', "%{$request->search}%")
            );
        }

        $posts = $query->latest('published_at')->paginate(12)->withQueryString();

        return Inertia::render('Blog/Index', [
            'posts'   => $posts,
            'filters' => $request->only(['search', 'sort']),
            'lang'    => 'en',
        ]);
    }

    public function showEn(string $slug): Response
    {
        $post = Post::published()
            ->where('slug_en', $slug)
            ->with(['category', 'author', 'tags', 'affiliates'])
            ->firstOrFail();

        $post->increment('views_count');

        $related = Post::published()
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->with(['category', 'author'])
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Blog/Show', [
            'post'    => $post,
            'related' => $related,
            'lang'    => 'en',
        ]);
    }
}
