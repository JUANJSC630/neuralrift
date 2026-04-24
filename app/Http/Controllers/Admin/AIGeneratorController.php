<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\GeneratePostRequest;
use App\Jobs\GeneratePostDraftJob;
use App\Models\Affiliate;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AIGeneratorController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/AIGenerator', [
            'categories' => Category::orderBy('order')->get(['id', 'name', 'color', 'icon']),
            'affiliates' => Affiliate::active()->orderBy('name')->get(['id', 'name', 'category']),
            'activeJob' => Cache::get("ai_job:user:{$request->user()->id}"),
        ]);
    }

    public function generate(GeneratePostRequest $request): RedirectResponse
    {
        $userId = $request->user()->id;

        Cache::put("ai_job:user:{$userId}", [
            'status' => 'pending',
            'topic' => Str::limit($request->input('topic'), 120),
            'type' => $request->input('post_type'),
            'started_at' => now()->toIso8601String(),
        ], 600);

        GeneratePostDraftJob::dispatch(
            $request->validated(),
            $userId,
        )->onQueue('ai-generation');

        return redirect()
            ->route('admin.ai-generator')
            ->with('success', '✦ Borrador en cola. Te avisamos cuando esté listo (~30–60 s).');
    }

    public function status(Request $request): JsonResponse
    {
        return response()->json([
            'job' => Cache::get("ai_job:user:{$request->user()->id}"),
        ]);
    }
}
