<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Crear usuario admin
        User::factory()->create([
            'name'   => 'Juan Jose',
            'email'  => 'admin@neuralrift.com',
            'role'   => 'admin',
            'bio'    => 'Desarrollador y apasionado de la IA. Escribo sobre tecnología, herramientas y negocios digitales.',
        ]);

        // Correr seeders en orden
        $this->call([
            CategorySeeder::class,
            TagSeeder::class,
            AffiliateSeeder::class,
            PostSeeder::class,
            SubscriberSeeder::class,
            PostViewSeeder::class,
        ]);
    }
}
