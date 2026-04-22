<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    public function sitemap(): Response
    {
        $sitemap = Sitemap::create()
            ->add(Url::create('/')->setPriority(1.0)->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY))
            ->add(Url::create('/blog')->setPriority(0.9)->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY))
            ->add(Url::create('/herramientas')->setPriority(0.8))
            ->add(Url::create('/sobre-mi')->setPriority(0.5));

        Post::published()->each(function (Post $post) use ($sitemap) {
            $sitemap->add(
                Url::create("/blog/{$post->slug}")
                    ->setLastModificationDate($post->updated_at)
                    ->setPriority(0.7)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
            );
            if ($post->slug_en) {
                $sitemap->add(
                    Url::create("/en/blog/{$post->slug_en}")
                        ->setLastModificationDate($post->updated_at)
                        ->setPriority(0.7)
                );
            }
        });

        return response($sitemap->render(), 200, ['Content-Type' => 'application/xml']);
    }

    public function rss(): Response
    {
        $posts = Post::published()
            ->with(['author', 'category'])
            ->latest('published_at')
            ->take(20)
            ->get();

        $xml = view('rss', compact('posts'))->render();
        return response($xml, 200, ['Content-Type' => 'application/rss+xml']);
    }

    public function robots(): Response
    {
        $content = "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: " . url('/sitemap.xml');
        return response($content, 200, ['Content-Type' => 'text/plain']);
    }
}
