<?php

namespace App\Http\Controllers;

use App\Models\Affiliate;
use App\Models\AffiliateClick;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AffiliateController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Affiliate::active()
            ->orderBy('order')
            ->orderByDesc('featured');

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        return Inertia::render('Tools', [
            'affiliates' => $query->paginate(9)->withQueryString(),
            'categories' => Affiliate::active()
                ->whereNotNull('category')
                ->distinct()
                ->orderBy('category')
                ->pluck('category'),
            'filters' => $request->only('category'),
            'canonical' => url(app()->getLocale() === 'en' ? '/en/tools' : '/herramientas'),
        ]);
    }

    public function click(string $slug, Request $request): RedirectResponse
    {
        $affiliate = Affiliate::where('slug', $slug)->active()->firstOrFail();

        AffiliateClick::create([
            'affiliate_id' => $affiliate->id,
            'post_id' => $request->query('post'),
            'ip' => $request->ip(),
            'clicked_at' => now(),
        ]);

        $affiliate->increment('clicks_count');

        return redirect()->away($affiliate->url);
    }
}
