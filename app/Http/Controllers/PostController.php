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
        $lang = app()->getLocale();
        $isEn = $lang === 'en';

        $query = Post::published()
            ->with(['category', 'author', 'tags'])
            ->forLang($lang);

        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }
        if ($request->tag) {
            $query->whereHas('tags', fn($q) => $q->where('slug', $request->tag));
        }
        if ($request->search) {
            $search = $request->search;
            $query->where(
                fn($q) => $isEn
                    ? $q->where('title_en', 'like', "%{$search}%")->orWhere('title', 'like', "%{$search}%")
                    : $q->where('title', 'like', "%{$search}%")->orWhere('excerpt', 'like', "%{$search}%")
            );
        }

        match ($request->sort ?? 'recent') {
            'popular'  => $query->orderByDesc('views_count'),
            'shortest' => $query->orderBy('read_time'),
            default    => $query->latest('published_at'),
        };

        $posts = $query->paginate(12)->withQueryString();

        return Inertia::render('Blog/Index', [
            'posts'     => $posts,
            'filters'   => $request->only(['category', 'tag', 'search', 'sort']),
            'lang'      => $lang,
            'canonical' => url($isEn ? '/en/blog' : '/blog'),
        ]);
    }

    public function show(string $slug): Response
    {
        $lang = app()->getLocale();
        $isEn = $lang === 'en';

        $slugColumn = $isEn ? 'slug_en' : 'slug';

        $post = Post::published()
            ->where($slugColumn, $slug)
            ->with(['category', 'author', 'tags', 'affiliates'])
            ->withCount('approvedComments as comments_count')
            ->firstOrFail();

        // Load threaded approved comments
        $comments = $post->approvedComments()
            ->whereNull('parent_id')
            ->with(['replies' => function ($q) {
                $q->approved()
                    ->with(['replies' => function ($q2) {
                        $q2->approved()->oldest();
                    }])
                    ->oldest();
            }])
            ->oldest()
            ->get();

        $related = Post::published()
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->forLang($lang)
            ->with(['category', 'author'])
            ->latest('published_at')
            ->take(3)
            ->get();

        $title = $isEn && $post->title_en ? $post->title_en : $post->title;
        $desc  = $isEn && $post->excerpt_en ? $post->excerpt_en : $post->excerpt;

        $schema = [
            '@context'      => 'https://schema.org',
            '@type'         => 'BlogPosting',
            'headline'      => $title,
            'description'   => $desc,
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

        if ($post->og_image || $post->cover_image) {
            $schema['image'] = $post->og_image ?: $post->cover_image;
        }

        return Inertia::render('Blog/Show', [
            'post'       => $post,
            'comments'   => $comments,
            'related'    => $related,
            'schema'     => $schema,
            'lang'       => $lang,
            'canonical'  => url($isEn ? "/en/blog/{$post->slug_en}" : "/blog/{$post->slug}"),
            'alternates' => [
                'es' => url("/blog/{$post->slug}"),
                'en' => $post->slug_en ? url("/en/blog/{$post->slug_en}") : null,
            ],
        ]);
    }
}
