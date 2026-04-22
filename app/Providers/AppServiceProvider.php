<?php

namespace App\Providers;

use App\Models\Category;
use App\Observers\CategoryObserver;
use App\Repositories\AffiliateRepository;
use App\Repositories\CategoryRepository;
use App\Repositories\Contracts\AffiliateRepositoryInterface;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Contracts\PostRepositoryInterface;
use App\Repositories\PostRepository;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PostRepositoryInterface::class, PostRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(AffiliateRepositoryInterface::class, AffiliateRepository::class);
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Category::observe(CategoryObserver::class);
    }
}
