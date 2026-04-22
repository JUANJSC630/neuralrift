<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'IA Generativa',
                'name_en' => 'Generative AI',
                'color' => '#7C6AF7',
                'icon' => '✦',
                'order' => 1,
                'description' => 'Todo sobre modelos de lenguaje, imagen y audio generativos.'
            ],
            [
                'name' => 'Herramientas',
                'name_en' => 'Tools',
                'color' => '#06B6D4',
                'icon' => '⚡',
                'order' => 2,
                'description' => 'Reviews y comparativas de las mejores herramientas IA.'
            ],
            [
                'name' => 'Tutoriales',
                'name_en' => 'Tutorials',
                'color' => '#10B981',
                'icon' => '◈',
                'order' => 3,
                'description' => 'Guías paso a paso para dominar la inteligencia artificial.'
            ],
            [
                'name' => 'Reviews',
                'name_en' => 'Reviews',
                'color' => '#F59E0B',
                'icon' => '★',
                'order' => 4,
                'description' => 'Análisis honestos y en profundidad de productos y servicios IA.'
            ],
            [
                'name' => 'Negocios',
                'name_en' => 'Business',
                'color' => '#EC4899',
                'icon' => '◉',
                'order' => 5,
                'description' => 'Cómo monetizar y escalar negocios con inteligencia artificial.'
            ],
            [
                'name' => 'Noticias',
                'name_en' => 'News',
                'color' => '#F97316',
                'icon' => '≋',
                'order' => 6,
                'description' => 'Las últimas novedades del ecosistema de IA.'
            ],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
