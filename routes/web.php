<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AffiliateController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PostViewController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\AffiliateController as AdminAffiliateController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\NewsletterController as AdminNewsletterController;
use App\Http\Controllers\Admin\SettingsController;

// ── SEO ──────────────────────────────────────────────────
Route::get('/sitemap.xml', [SeoController::class, 'sitemap']);
Route::get('/feed.xml',    [SeoController::class, 'rss']);
Route::get('/robots.txt',  [SeoController::class, 'robots']);

// ── PÚBLICAS ─────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/sobre-mi', fn() => Inertia::render('About'))->name('about');
Route::get('/herramientas', [AffiliateController::class, 'index'])->name('tools');
Route::get('/herramientas/{slug}/click', [AffiliateController::class, 'click'])->name('tools.click');

// Blog ES
Route::prefix('blog')->name('blog.')->group(function () {
    Route::get('/',        [PostController::class, 'index'])->name('index');
    Route::get('/{slug}',  [PostController::class, 'show'])->name('show');
});

// Blog EN
Route::prefix('en')->name('en.')->group(function () {
    Route::get('/blog',        [PostController::class, 'indexEn'])->name('blog.index');
    Route::get('/blog/{slug}', [PostController::class, 'showEn'])->name('blog.show');
});

// Categorías
Route::get('/categorias',        [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categoria/{slug}',  [CategoryController::class, 'show'])->name('category.show');

// Newsletter
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
Route::get('/newsletter/confirm/{token}', [NewsletterController::class, 'confirm'])->name('newsletter.confirm');

// Analytics (AJAX, sin SSR)
Route::post('/api/views/{post}', [PostViewController::class, 'store'])->name('views.store');

// ── ADMIN ─────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Posts
    Route::resource('posts', AdminPostController::class);
    Route::post('/posts/{post}/publish',   [AdminPostController::class, 'publish'])->name('posts.publish');
    Route::post('/posts/{post}/duplicate', [AdminPostController::class, 'duplicate'])->name('posts.duplicate');

    // Upload de imágenes desde editor
    Route::post('/upload/image', [UploadController::class, 'image'])->name('upload.image');

    // Recursos
    Route::resource('categories', AdminCategoryController::class);
    Route::resource('affiliates', AdminAffiliateController::class);

    // Páginas
    Route::get('/analytics',  [AnalyticsController::class, 'index'])->name('analytics');
    Route::get('/newsletter', [AdminNewsletterController::class, 'index'])->name('newsletter');
    Route::delete('/newsletter/{subscriber}', [AdminNewsletterController::class, 'destroy'])->name('newsletter.destroy');
    Route::get('/settings',   [SettingsController::class, 'index'])->name('settings');
    Route::post('/settings',  [SettingsController::class, 'update'])->name('settings.update');
});

// Auth routes (Breeze)
require __DIR__.'/auth.php';
