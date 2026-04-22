<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\GeneratePostRequest;
use App\Jobs\GeneratePostDraftJob;
use App\Models\Affiliate;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AIGeneratorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/AIGenerator', [
            'categories' => Category::orderBy('order')->get(['id', 'name', 'color', 'icon']),
            'affiliates' => Affiliate::active()->orderBy('name')->get(['id', 'name', 'category']),
        ]);
    }

    public function generate(GeneratePostRequest $request): RedirectResponse
    {
        GeneratePostDraftJob::dispatch(
            $request->validated(),
            $request->user()->id,
        )->onQueue('ai-generation');

        return redirect()
            ->route('admin.posts.index', ['status' => 'review'])
            ->with('success', '✦ Generando borrador con IA... Aparecerá en "En revisión" en 30-60 segundos. Recibirás una notificación cuando esté listo.');
    }
}
