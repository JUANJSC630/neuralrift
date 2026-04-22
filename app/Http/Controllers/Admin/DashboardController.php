<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Subscriber;
use App\Models\PostView;
use App\Models\AffiliateClick;
use App\Models\Affiliate;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $kpis = [
            'posts_published'  => Post::published()->count(),
            'posts_draft'      => Post::where('status', 'draft')->count(),
            'posts_scheduled'  => Post::where('status', 'scheduled')->count(),
            'subscribers'      => Subscriber::confirmed()->count(),
            'subscribers_week' => Subscriber::confirmed()
                ->where('confirmed_at', '>=', now()->subWeek())->count(),
            'views_today'      => PostView::whereDate('viewed_at', today())->count(),
            'views_week'       => PostView::where('viewed_at', '>=', now()->subWeek())->count(),
            'views_month'      => PostView::where('viewed_at', '>=', now()->subMonth())->count(),
            'clicks_month'     => AffiliateClick::where('clicked_at', '>=', now()->subMonth())->count(),
        ];

        $viewsByDay = PostView::where('viewed_at', '>=', now()->subDays(29))
            ->selectRaw('DATE(viewed_at) as date, COUNT(*) as views')
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('views', 'date');

        $chartData = collect(range(29, 0))->map(function ($daysAgo) use ($viewsByDay) {
            $date = now()->subDays($daysAgo)->format('Y-m-d');
            return [
                'date'  => now()->subDays($daysAgo)->format('d M'),
                'views' => $viewsByDay[$date] ?? 0,
            ];
        })->values();

        $recentPosts = Post::with(['category'])
            ->latest()
            ->take(8)
            ->get(['id', 'title', 'status', 'views_count', 'published_at', 'category_id', 'lang']);

        $topPosts = Post::published()
            ->withCount(['views as week_views' => fn($q) =>
                $q->where('viewed_at', '>=', now()->subWeek())
            ])
            ->orderByDesc('week_views')
            ->take(5)
            ->get(['id', 'title', 'slug', 'views_count']);

        $topAffiliate = Affiliate::orderByDesc('clicks_count')->first();

        return Inertia::render('Admin/Dashboard', [
            'kpis'         => $kpis,
            'chartData'    => $chartData,
            'recentPosts'  => $recentPosts,
            'topPosts'     => $topPosts,
            'topAffiliate' => $topAffiliate,
        ]);
    }
}
