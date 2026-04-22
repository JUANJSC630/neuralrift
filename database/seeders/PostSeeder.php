<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Affiliate;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $user       = User::first();
        $categories = Category::all()->keyBy('slug');
        $tags       = Tag::all();

        $posts = [
            [
                'title'          => 'GPT-4o y el futuro de los asistentes multimodales: análisis tras 6 meses de uso',
                'title_en'       => 'GPT-4o and the Future of Multimodal Assistants: 6-Month Analysis',
                'slug'           => 'gpt-4o-asistentes-multimodales-analisis',
                'slug_en'        => 'gpt-4o-multimodal-assistants-analysis',
                'excerpt'        => 'Después de integrar GPT-4o en mis flujos de trabajo durante medio año, aquí está mi análisis honesto: capacidades reales, limitaciones y los casos de uso que nadie menciona.',
                'content'        => json_encode(['type' => 'doc', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Contenido de ejemplo para GPT-4o.']]]]]),
                'status'         => 'published',
                'lang'           => 'both',
                'featured'       => true,
                'published_at'   => now()->subDays(2),
                'category_slug'  => 'ia-generativa',
                'tags'           => ['ChatGPT', 'GPT-4o', 'Multimodal'],
                'affiliates'     => ['writesonic'],
            ],
            [
                'title'          => 'Las 10 mejores herramientas IA para crear contenido en 2026',
                'title_en'       => '10 Best AI Content Creation Tools in 2026',
                'slug'           => 'mejores-herramientas-ia-contenido-2026',
                'slug_en'        => 'best-ai-content-tools-2026',
                'excerpt'        => 'He probado más de 30 herramientas IA este año. Estas son las 10 que realmente valen la pena y que uso en mi flujo de trabajo diario.',
                'content'        => json_encode(['type' => 'doc', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Contenido de ejemplo para herramientas IA.']]]]]),
                'status'         => 'published',
                'lang'           => 'both',
                'featured'       => false,
                'published_at'   => now()->subDays(5),
                'category_slug'  => 'herramientas',
                'tags'           => ['Copywriting IA', 'Automatización'],
                'affiliates'     => ['writesonic', 'copy-ai'],
            ],
            [
                'title'          => 'Cómo ganar dinero con afiliados de IA: guía completa 2026',
                'title_en'       => 'How to Make Money with AI Affiliate Marketing: Complete Guide 2026',
                'slug'           => 'ganar-dinero-afiliados-ia-2026',
                'slug_en'        => 'make-money-ai-affiliate-marketing-2026',
                'excerpt'        => 'El nicho de afiliados de herramientas IA es el más rentable del momento. Te explico exactamente cómo estructurar tu blog para maximizar las comisiones.',
                'content'        => json_encode(['type' => 'doc', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Contenido de ejemplo para afiliados IA.']]]]]),
                'status'         => 'published',
                'lang'           => 'es',
                'featured'       => false,
                'published_at'   => now()->subDays(8),
                'category_slug'  => 'negocios',
                'tags'           => ['Afiliados', 'SEO con IA'],
                'affiliates'     => ['neuronwriter'],
            ],
            [
                'title'          => 'Prompt Engineering avanzado: técnicas que los expertos no publican',
                'slug'           => 'prompt-engineering-avanzado-tecnicas',
                'excerpt'        => 'Más allá del prompting básico. Estas son las técnicas avanzadas de ingeniería de prompts que uso para obtener resultados extraordinarios con cualquier LLM.',
                'content'        => json_encode(['type' => 'doc', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Contenido de ejemplo para prompt engineering.']]]]]),
                'status'         => 'published',
                'lang'           => 'es',
                'featured'       => false,
                'published_at'   => now()->subDays(12),
                'category_slug'  => 'tutoriales',
                'tags'           => ['Prompt Engineering', 'ChatGPT', 'Claude'],
                'affiliates'     => [],
            ],
            [
                'title'          => 'ElevenLabs vs Murf AI: ¿cuál es la mejor IA de voz en 2026?',
                'slug'           => 'elevenlabs-vs-murf-ai-comparativa-2026',
                'excerpt'        => 'Comparativa exhaustiva entre las dos mejores plataformas de síntesis de voz con IA. Precios, calidad, casos de uso y cuál te conviene según tu proyecto.',
                'content'        => json_encode(['type' => 'doc', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Contenido de ejemplo para comparativa de voz IA.']]]]]),
                'status'         => 'published',
                'lang'           => 'es',
                'featured'       => false,
                'published_at'   => now()->subDays(15),
                'category_slug'  => 'reviews',
                'tags'           => ['Automatización'],
                'affiliates'     => ['elevenlabs'],
            ],
            [
                'title'          => 'OpenAI lanza o3-mini: lo que necesitas saber',
                'slug'           => 'openai-o3-mini-lanzamiento-analisis',
                'excerpt'        => 'OpenAI acaba de anunciar o3-mini, su nuevo modelo de razonamiento avanzado. Analizamos las capacidades, el precio y cómo se compara con Claude 3.5.',
                'content'        => json_encode(['type' => 'doc', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Contenido de ejemplo para noticias OpenAI.']]]]]),
                'status'         => 'published',
                'lang'           => 'es',
                'featured'       => false,
                'published_at'   => now()->subDays(1),
                'category_slug'  => 'noticias',
                'tags'           => ['GPT-4o', 'Open Source'],
                'affiliates'     => [],
            ],
            // Borrador de ejemplo
            [
                'title'          => 'Cómo usar Claude API para automatizar tu negocio',
                'slug'           => 'claude-api-automatizar-negocio',
                'excerpt'        => 'Guía práctica para integrar Claude en tus flujos de trabajo.',
                'content'        => json_encode(['type' => 'doc', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Borrador en progreso...']]]]]),
                'status'         => 'draft',
                'lang'           => 'es',
                'featured'       => false,
                'published_at'   => null,
                'category_slug'  => 'tutoriales',
                'tags'           => ['Claude', 'API', 'Automatización'],
                'affiliates'     => [],
            ],
        ];

        foreach ($posts as $data) {
            $tagNames      = $data['tags'];
            $affiliateSlugs = $data['affiliates'];
            $categorySlug  = $data['category_slug'];

            unset($data['tags'], $data['affiliates'], $data['category_slug']);

            $post = Post::create([
                ...$data,
                'user_id'     => $user->id,
                'category_id' => $categories[$categorySlug]->id ?? null,
                'views_count' => rand(500, 25000),
            ]);

            // Attach tags
            $tagIds = $tags->whereIn('name', $tagNames)->pluck('id');
            $post->tags()->attach($tagIds);

            // Attach affiliates
            $affiliateIds = Affiliate::whereIn('slug', $affiliateSlugs)->pluck('id');
            $post->affiliates()->attach($affiliateIds);
        }
    }
}
