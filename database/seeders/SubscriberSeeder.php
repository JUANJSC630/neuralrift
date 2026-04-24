<?php

namespace Database\Seeders;

use App\Models\Subscriber;
use Illuminate\Database\Seeder;

class SubscriberSeeder extends Seeder
{
    public function run(): void
    {
        $subscribers = [
            ['email' => 'maria@example.com',    'name' => 'María García',    'confirmed' => true,  'lang' => 'es', 'confirmed_at' => now()->subDays(rand(1, 30))],
            ['email' => 'carlos@example.com',   'name' => 'Carlos López',    'confirmed' => true,  'lang' => 'es', 'confirmed_at' => now()->subDays(rand(1, 30))],
            ['email' => 'john@example.com',     'name' => 'John Smith',      'confirmed' => true,  'lang' => 'en', 'confirmed_at' => now()->subDays(rand(1, 30))],
            ['email' => 'ana@example.com',      'name' => 'Ana Martínez',    'confirmed' => true,  'lang' => 'es', 'confirmed_at' => now()->subDays(rand(1, 30))],
            ['email' => 'pedro@example.com',    'name' => 'Pedro Rodríguez', 'confirmed' => false, 'lang' => 'es'],
            ['email' => 'lucia@example.com',    'name' => 'Lucía Fernández', 'confirmed' => true,  'lang' => 'es', 'confirmed_at' => now()->subDays(rand(1, 30))],
            ['email' => 'james@example.com',    'name' => 'James Wilson',    'confirmed' => true,  'lang' => 'en', 'confirmed_at' => now()->subDays(rand(1, 30))],
            ['email' => 'sofia@example.com',    'name' => 'Sofía Torres',    'confirmed' => true,  'lang' => 'es', 'confirmed_at' => now()->subDays(rand(1, 30))],
        ];

        foreach ($subscribers as $sub) {
            Subscriber::create($sub);
        }
    }
}
