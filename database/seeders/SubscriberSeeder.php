<?php
namespace Database\Seeders;

use App\Models\Subscriber;
use Illuminate\Database\Seeder;

class SubscriberSeeder extends Seeder
{
    public function run(): void
    {
        $subscribers = [
            ['email' => 'maria@example.com',    'name' => 'María García',    'confirmed' => true,  'lang' => 'es'],
            ['email' => 'carlos@example.com',   'name' => 'Carlos López',    'confirmed' => true,  'lang' => 'es'],
            ['email' => 'john@example.com',     'name' => 'John Smith',      'confirmed' => true,  'lang' => 'en'],
            ['email' => 'ana@example.com',      'name' => 'Ana Martínez',    'confirmed' => true,  'lang' => 'es'],
            ['email' => 'pedro@example.com',    'name' => 'Pedro Rodríguez', 'confirmed' => false, 'lang' => 'es'],
            ['email' => 'lucia@example.com',    'name' => 'Lucía Fernández', 'confirmed' => true,  'lang' => 'es'],
            ['email' => 'james@example.com',    'name' => 'James Wilson',    'confirmed' => true,  'lang' => 'en'],
            ['email' => 'sofia@example.com',    'name' => 'Sofía Torres',    'confirmed' => true,  'lang' => 'es'],
        ];

        foreach ($subscribers as $sub) {
            Subscriber::create($sub);
        }
    }
}