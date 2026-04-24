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
            [
                'name' => 'Desarrollo Web',
                'name_en' => 'Web Dev',
                'color' => '#3B82F6',
                'icon' => '⟨/⟩',
                'order' => 7,
                'description' => 'Laravel, React, Inertia, deploy y arquitectura web moderna.',
                'description_en' => 'Laravel, React, Inertia, deployment and modern web architecture.',
            ],
            [
                'name' => 'Productividad',
                'name_en' => 'Productivity',
                'color' => '#8B5CF6',
                'icon' => '⊡',
                'order' => 8,
                'description' => 'Herramientas y sistemas para trabajar mejor y en menos tiempo.',
                'description_en' => 'Tools and systems to work smarter and faster.',
            ],
            [
                'name' => 'Freelancing',
                'name_en' => 'Freelancing',
                'color' => '#14B8A6',
                'icon' => '◆',
                'order' => 9,
                'description' => 'Cómo conseguir clientes, cobrar en dólares y escalar como freelancer desde LATAM.',
                'description_en' => 'How to get clients, charge in USD and scale as a freelancer from LATAM.',
            ],
            [
                'name' => 'Automatización',
                'name_en' => 'Automation',
                'color' => '#EF4444',
                'icon' => '⟳',
                'order' => 10,
                'description' => 'Make, n8n, Zapier y flujos de trabajo que ahorran horas cada semana.',
                'description_en' => 'Make, n8n, Zapier and workflows that save hours every week.',
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['name' => $cat['name']], $cat);
        }
    }
}
