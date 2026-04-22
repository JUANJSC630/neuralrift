<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostView;
use App\Models\AffiliateClick;
use App\Models\Affiliate;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $days = (int) $request->get('days', 30);
        $from = now()->subDays($days);

        $viewsChart = collect(range($days - 1, 0))->map(fn($d) => [
            'date'  => now()->subDays($d)->format('d M'),
            'views' => PostView::whereDate('viewed_at', now()->subDays($d))->count(),
        ])->values();

        $sources = PostView::where('viewed_at', '>=', $from)
            ->selectRaw('source, count(*) as total')
            ->groupBy('source')
            ->pluck('total', 'source');

        $topPosts = Post::published()
            ->withCount(['views as period_views' => fn($q) =>
                $q->where('viewed_at', '>=', $from)
            ])
            ->orderByDesc('period_views')
            ->take(10)
            ->get(['id', 'title', 'slug', 'views_count']);

        $countries = PostView::where('viewed_at', '>=', $from)
            ->whereNotNull('country')
            ->selectRaw('country, count(*) as total')
            ->groupBy('country')
            ->orderByDesc('total')
            ->take(10)
            ->get();

        $affiliateStats = Affiliate::withCount(['clicks as period_clicks' => fn($q) =>
            $q->where('clicked_at', '>=', $from)
        ])->orderByDesc('period_clicks')->get(['id', 'name', 'clicks_count']);

        $totals = [
            'views'       => PostView::where('viewed_at', '>=', $from)->count(),
            'subscribers' => Subscriber::where('confirmed_at', '>=', $from)->count(),
            'clicks'      => AffiliateClick::where('clicked_at', '>=', $from)->count(),
        ];

        return Inertia::render('Admin/Analytics', [
            'viewsChart'     => $viewsChart,
            'sources'        => $sources,
            'topPosts'       => $topPosts,
            'countries'      => $countries,
            'affiliateStats' => $affiliateStats,
            'totals'         => $totals,
            'days'           => $days,
        ]);
    }
}
