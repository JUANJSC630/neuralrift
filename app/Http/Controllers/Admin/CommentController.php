<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Comment::with(['post:id,title,slug', 'parent:id,author_name'])
            ->latest();

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('author_name', 'like', "%{$search}%")
                    ->orWhere('author_email', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%");
            });
        }

        $comments = $query->paginate(20)->withQueryString();

        $counts = [
            'pending' => Comment::pending()->count(),
            'approved' => Comment::approved()->count(),
            'spam' => Comment::where('status', 'spam')->count(),
        ];

        return Inertia::render('Admin/Comments', [
            'comments' => $comments,
            'filters' => $request->only(['status', 'search']),
            'counts' => $counts,
        ]);
    }

    public function approve(Comment $comment): RedirectResponse
    {
        $comment->update(['status' => 'approved']);

        return back()->with('success', 'Comentario aprobado.');
    }

    public function spam(Comment $comment): RedirectResponse
    {
        $comment->update(['status' => 'spam']);

        return back()->with('success', 'Comentario marcado como spam.');
    }

    public function destroy(Comment $comment): RedirectResponse
    {
        $comment->delete();

        return back()->with('success', 'Comentario eliminado.');
    }
}
