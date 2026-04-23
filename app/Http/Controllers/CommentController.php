<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Post $post): RedirectResponse
    {
        if (! $post->allow_comments || $post->status !== 'published') {
            abort(403);
        }

        // Honeypot — if filled, silently discard (bot)
        if ($request->filled('website_url')) {
            return back()->with('success', __('Tu comentario fue enviado y está pendiente de aprobación.'));
        }

        $validated = $request->validate([
            'author_name'  => ['required', 'string', 'max:80'],
            'author_email' => ['required', 'email', 'max:255'],
            'body'         => ['required', 'string', 'min:3', 'max:2000'],
            'parent_id'    => ['nullable', 'integer', 'exists:comments,id'],
        ]);

        $depth = 0;
        if (! empty($validated['parent_id'])) {
            $parent = Comment::where('id', $validated['parent_id'])
                ->where('post_id', $post->id)
                ->firstOrFail();

            if (! $parent->canHaveReplies()) {
                return back()->withErrors(['parent_id' => 'No se puede responder a este nivel.']);
            }

            $depth = $parent->depth + 1;
        }

        // Auto-approve admin/author comments
        $user = $request->user();
        $autoApprove = $user && in_array($user->role, ['admin', 'editor']);

        Comment::create([
            'post_id'      => $post->id,
            'parent_id'    => $validated['parent_id'] ?? null,
            'user_id'      => $user?->id,
            'author_name'  => strip_tags($validated['author_name']),
            'author_email' => $validated['author_email'],
            'body'         => strip_tags($validated['body']),
            'status'       => $autoApprove ? 'approved' : 'pending',
            'ip_address'   => $request->ip(),
            'user_agent'   => $request->userAgent(),
            'depth'        => $depth,
        ]);

        $message = $autoApprove
            ? __('Comentario publicado.')
            : __('Tu comentario fue enviado y está pendiente de aprobación.');

        return back()->with('success', $message);
    }
}
