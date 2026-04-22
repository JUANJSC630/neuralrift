<?php
namespace Database\Seeders;

use App\Models\Post;
use App\Models\PostView;
use Illuminate\Database\Seeder;

class PostViewSeeder extends Seeder
{
    public function run(): void
    {
        $posts   = Post::published()->get();
        $sources = ['organic', 'social', 'direct', 'referral'];
        $countries = ['CO', 'MX', 'ES', 'AR', 'US', 'PE', 'CL', 'EC'];

        foreach ($posts as $post) {
            // Generar views de los últimos 30 días
            $totalViews = rand(100, 500);
            for ($i = 0; $i < $totalViews; $i++) {
                PostView::create([
                    'post_id'   => $post->id,
                    'ip'        => fake()->ipv4(),
                    'country'   => $countries[array_rand($countries)],
                    'source'    => $sources[array_rand($sources)],
                    'referrer'  => fake()->optional()->url(),
                    'viewed_at' => now()->subDays(rand(0, 30))->subHours(rand(0, 23)),
                ]);
            }
        }
    }
}