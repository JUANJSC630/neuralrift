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
use App\Http\Controllers\Admin\AIGeneratorController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\ImageController;

// ── SEO ──────────────────────────────────────────────────
Route::get('/sitemap.xml', [SeoController::class, 'sitemap']);
Route::get('/feed.xml',    [SeoController::class, 'rss']);
Route::get('/robots.txt',  [SeoController::class, 'robots']);

// ── PÚBLICAS — ES (default) ──────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/sobre-mi', fn() => Inertia::render('About'))->name('about');
Route::get('/herramientas', [AffiliateController::class, 'index'])->name('tools');
Route::get('/herramientas/{slug}/click', [AffiliateController::class, 'click'])->name('tools.click')->middleware('throttle:30,1');

Route::prefix('blog')->name('blog.')->group(function () {
    Route::get('/',        [PostController::class, 'index'])->name('index');
    Route::get('/{slug}',  [PostController::class, 'show'])->name('show');
});

Route::get('/categorias',        [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categoria/{slug}',  [CategoryController::class, 'show'])->name('category.show');

Route::get('/privacidad', fn() => Inertia::render('Legal/Privacy'))->name('legal.privacy');
Route::get('/terminos',   fn() => Inertia::render('Legal/Terms'))->name('legal.terms');
Route::get('/cookies',    fn() => Inertia::render('Legal/Cookies'))->name('legal.cookies');
Route::get('/afiliados',  fn() => Inertia::render('Legal/Affiliates'))->name('legal.affiliates');

// ── PÚBLICAS — EN (mirror) ──────────────────────────────
Route::prefix('en')->name('en.')->group(function () {
    Route::get('/',      [HomeController::class, 'index'])->name('home');
    Route::get('/about', fn() => Inertia::render('About'))->name('about');
    Route::get('/tools', [AffiliateController::class, 'index'])->name('tools');

    Route::prefix('blog')->name('blog.')->group(function () {
        Route::get('/',        [PostController::class, 'index'])->name('index');
        Route::get('/{slug}',  [PostController::class, 'show'])->name('show');
    });

    Route::get('/categories',       [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/category/{slug}',  [CategoryController::class, 'show'])->name('category.show');

    Route::get('/privacy',    fn() => Inertia::render('Legal/Privacy'))->name('legal.privacy');
    Route::get('/terms',      fn() => Inertia::render('Legal/Terms'))->name('legal.terms');
    Route::get('/cookies',    fn() => Inertia::render('Legal/Cookies'))->name('legal.cookies');
    Route::get('/affiliates', fn() => Inertia::render('Legal/Affiliates'))->name('legal.affiliates');
});

// Newsletter
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe')->middleware('throttle:3,60');
Route::get('/newsletter/confirm/{token}', [NewsletterController::class, 'confirm'])->name('newsletter.confirm');

// Analytics (AJAX, sin SSR)
Route::post('/api/views/{post}', [PostViewController::class, 'store'])->name('views.store')->middleware('throttle:10,1');

// ── ADMIN ─────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Posts
    Route::resource('posts', AdminPostController::class);
    Route::post('/posts/{post}/publish',   [AdminPostController::class, 'publish'])->name('posts.publish');
    Route::post('/posts/{post}/duplicate', [AdminPostController::class, 'duplicate'])->name('posts.duplicate');

    // AI Generator
    Route::get('/ai-generator', [AIGeneratorController::class, 'index'])
        ->name('ai-generator');
    Route::post('/ai-generator/generate', [AIGeneratorController::class, 'generate'])
        ->name('ai-generator.generate')
        ->middleware('throttle:5,1');

    // Notifications (polling for AI job status)
    Route::get('/notifications/unread', [NotificationController::class, 'unread'])
        ->name('notifications.unread');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead'])
        ->name('notifications.markRead');

    // Upload de imágenes desde editor
    Route::post('/upload/image', [UploadController::class, 'image'])->name('upload.image');

    // Gestión de imágenes
    Route::get('/images', [ImageController::class, 'index'])->name('images.index');
    Route::delete('/images', [ImageController::class, 'destroy'])->name('images.destroy');

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
