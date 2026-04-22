<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            'ChatGPT',
            'Claude',
            'Gemini',
            'GPT-4o',
            'Llama',
            'Midjourney',
            'Stable Diffusion',
            'DALL-E',
            'Prompt Engineering',
            'Fine-tuning',
            'RAG',
            'LangChain',
            'Automatización',
            'API',
            'Open Source',
            'Afiliados',
            'SEO con IA',
            'Copywriting IA',
            'Agentes IA',
            'Multimodal',
        ];

        foreach ($tags as $tag) {
            Tag::create([
                'name' => $tag,
                'slug' => str($tag)->slug(),
            ]);
        }
    }
}
