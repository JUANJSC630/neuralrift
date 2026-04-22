<?php

namespace Database\Seeders;

use App\Models\Affiliate;
use Illuminate\Database\Seeder;

class AffiliateSeeder extends Seeder
{
    public function run(): void
    {
        $affiliates = [
            [
                'name'             => 'Writesonic',
                'url'              => 'https://writesonic.com?ref=neuralrift',
                'website'          => 'https://writesonic.com',
                'description'      => 'El escritor IA más completo para blogs y copywriting.',
                'commission'       => '30% recurrente de por vida',
                'commission_type'  => 'recurring',
                'commission_value' => 30,
                'cookie_duration'  => '30 días',
                'pros'             => ['Comisión de por vida', 'Interfaz intuitiva', 'Soporte en español'],
                'cons'             => ['Límite en plan gratuito'],
                'rating'           => 4.8,
                'category'         => 'Escritura IA',
                'badge'            => 'Lo uso diariamente',
                'featured'         => true,
            ],
            [
                'name'             => 'ElevenLabs',
                'url'              => 'https://elevenlabs.io?ref=neuralrift',
                'website'          => 'https://elevenlabs.io',
                'description'      => 'La mejor IA para generación de voz y audio realista.',
                'commission'       => '22% recurrente',
                'commission_type'  => 'recurring',
                'commission_value' => 22,
                'cookie_duration'  => '90 días',
                'pros'             => ['Cookie de 90 días', 'Nicho en explosión', 'Alta conversión'],
                'cons'             => ['Comisión menor que otros'],
                'rating'           => 4.7,
                'category'         => 'Audio IA',
                'badge'            => 'Partner Oficial',
                'featured'         => true,
            ],
            [
                'name'             => 'Hostinger',
                'url'              => 'https://hostinger.com?ref=neuralrift',
                'website'          => 'https://hostinger.com',
                'description'      => 'El hosting que uso para todos mis proyectos web.',
                'commission'       => 'Hasta 60% por venta',
                'commission_type'  => 'one_time',
                'commission_value' => 60,
                'cookie_duration'  => '30 días',
                'pros'             => ['Comisión altísima', 'Conversión excelente', 'Marca conocida'],
                'cons'             => ['Pago único, no recurrente'],
                'rating'           => 4.6,
                'category'         => 'Hosting',
                'badge'            => 'Lo uso diariamente',
                'featured'         => true,
            ],
            [
                'name'             => 'Copy.ai',
                'url'              => 'https://copy.ai?ref=neuralrift',
                'website'          => 'https://copy.ai',
                'description'      => 'IA de copywriting para marketing y ventas.',
                'commission'       => '45% primer año',
                'commission_type'  => 'recurring',
                'commission_value' => 45,
                'cookie_duration'  => '60 días',
                'pros'             => ['45% — una de las más altas', 'Cookie de 60 días'],
                'cons'             => ['Solo primer año'],
                'rating'           => 4.5,
                'category'         => 'Escritura IA',
                'badge'            => null,
                'featured'         => false,
            ],
            [
                'name'             => 'NeuronWriter',
                'url'              => 'https://neuronwriter.com?ref=neuralrift',
                'website'          => 'https://neuronwriter.com',
                'description'      => 'SEO + IA: la herramienta definitiva para rankear en Google.',
                'commission'       => '30% de por vida',
                'commission_type'  => 'recurring',
                'commission_value' => 30,
                'cookie_duration'  => '60 días',
                'pros'             => ['Comisión lifetime', 'Nicho SEO muy rentable'],
                'cons'             => ['Menos conocida que competidores'],
                'rating'           => 4.6,
                'category'         => 'SEO IA',
                'badge'            => 'Partner Oficial',
                'featured'         => true,
            ],
        ];

        foreach ($affiliates as $aff) {
            Affiliate::create($aff);
        }
    }
}
