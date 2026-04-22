<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Affiliate;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Post::with(['category', 'author'])->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->category) {
            $query->where('category_id', $request->category);
        }
        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        return Inertia::render('Admin/Posts/Index', [
            'posts'      => $query->paginate(15)->withQueryString(),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters'    => $request->only(['status', 'category', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Posts/Edit', [
            'post'       => null,
            'categories' => Category::orderBy('order')->get(),
            'tags'       => Tag::orderBy('name')->get(),
            'affiliates' => Affiliate::active()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'title_en'         => 'nullable|string|max:255',
            'excerpt'          => 'nullable|string|max:500',
            'excerpt_en'       => 'nullable|string|max:500',
            'content'          => 'nullable',
            'content_en'       => 'nullable',
            'category_id'      => 'nullable|exists:categories,id',
            'status'           => 'required|in:draft,review,scheduled,published',
            'lang'             => 'required|in:es,en,both',
            'featured'         => 'boolean',
            'allow_comments'   => 'boolean',
            'indexable'        => 'boolean',
            'published_at'     => 'nullable|date',
            'meta_title'       => 'nullable|string|max:70',
            'meta_description' => 'nullable|string|max:160',
            'cover_image'      => 'nullable|string',
            'og_image'         => 'nullable|string',
            'tags'             => 'nullable|array',
            'affiliates'       => 'nullable|array',
        ]);

        $post = Post::create([
            ...$validated,
            'user_id'      => auth()->id(),
            'published_at' => $validated['status'] === 'published'
                ? ($validated['published_at'] ?? now())
                : $validated['published_at'],
        ]);

        if (!empty($validated['tags'])) {
            $post->tags()->sync($validated['tags']);
        }
        if (!empty($validated['affiliates'])) {
            $post->affiliates()->sync($validated['affiliates']);
        }

        return redirect()->route('admin.posts.edit', $post)
            ->with('success', 'Artículo creado correctamente.');
    }

    public function show(Post $post): Response
    {
        return $this->edit($post);
    }

    public function edit(Post $post): Response
    {
        $post->load(['tags', 'affiliates', 'category']);

        return Inertia::render('Admin/Posts/Edit', [
            'post'       => $post,
            'categories' => Category::orderBy('order')->get(),
            'tags'       => Tag::orderBy('name')->get(),
            'affiliates' => Affiliate::active()->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'title_en'         => 'nullable|string|max:255',
            'excerpt'          => 'nullable|string|max:500',
            'excerpt_en'       => 'nullable|string|max:500',
            'content'          => 'nullable',
            'content_en'       => 'nullable',
            'category_id'      => 'nullable|exists:categories,id',
            'status'           => 'required|in:draft,review,scheduled,published',
            'lang'             => 'required|in:es,en,both',
            'featured'         => 'boolean',
            'allow_comments'   => 'boolean',
            'indexable'        => 'boolean',
            'published_at'     => 'nullable|date',
            'meta_title'       => 'nullable|string|max:70',
            'meta_description' => 'nullable|string|max:160',
            'cover_image'      => 'nullable|string',
            'og_image'         => 'nullable|string',
            'tags'             => 'nullable|array',
            'affiliates'       => 'nullable|array',
        ]);

        if ($validated['status'] === 'published' && !$post->published_at) {
            $validated['published_at'] = now();
        }

        $post->update($validated);
        $post->tags()->sync($validated['tags'] ?? []);
        $post->affiliates()->sync($validated['affiliates'] ?? []);

        return back()->with('success', 'Artículo actualizado.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();
        return redirect()->route('admin.posts.index')
            ->with('success', 'Artículo eliminado.');
    }

    public function publish(Post $post): RedirectResponse
    {
        $post->update([
            'status'       => 'published',
            'published_at' => $post->published_at ?? now(),
        ]);
        return back()->with('success', 'Artículo publicado.');
    }

    public function duplicate(Post $post): RedirectResponse
    {
        $new = $post->replicate();
        $new->title        = "[Copia] {$post->title}";
        $new->slug         = "{$post->slug}-copia-" . time();
        $new->slug_en      = $post->slug_en ? "{$post->slug_en}-copy-" . time() : null;
        $new->status       = 'draft';
        $new->published_at = null;
        $new->views_count  = 0;
        $new->featured     = false;
        $new->save();

        $new->tags()->sync($post->tags->pluck('id'));
        $new->affiliates()->sync($post->affiliates->pluck('id'));

        return redirect()->route('admin.posts.edit', $new)
            ->with('success', 'Artículo duplicado. Ahora estás editando la copia.');
    }
}
