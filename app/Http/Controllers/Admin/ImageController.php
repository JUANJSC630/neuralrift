<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Affiliate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ImageController extends Controller
{
    public function index(): Response
    {
        $images = $this->getAllImages();
        $usageMap = $this->buildUsageMap();

        $data = collect($images)->map(function (string $path) use ($usageMap) {
            $url = asset("storage/{$path}");
            $usedIn = $usageMap[$url] ?? [];

            return [
                'path'      => $path,
                'url'       => $url,
                'filename'  => basename($path),
                'size'      => Storage::disk('public')->size($path),
                'modified'  => Storage::disk('public')->lastModified($path),
                'used_in'   => $usedIn,
                'is_used'   => count($usedIn) > 0,
            ];
        })->sortByDesc('modified')->values();

        return Inertia::render('Admin/Images', [
            'images' => $data,
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $path = $request->input('path');

        // Prevent path traversal
        if (str_contains($path, '..') || !str_starts_with($path, 'posts/')) {
            return response()->json(['error' => 'Ruta inválida.'], 403);
        }

        if (!Storage::disk('public')->exists($path)) {
            return response()->json(['error' => 'Imagen no encontrada.'], 404);
        }

        Storage::disk('public')->delete($path);

        return response()->json(['success' => true, 'message' => 'Imagen eliminada.']);
    }

    private function getAllImages(): array
    {
        $files = Storage::disk('public')->allFiles('posts');

        return collect($files)->filter(function (string $file) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            return in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif']);
        })->values()->all();
    }

    private function buildUsageMap(): array
    {
        $map = [];

        // Check cover_image and og_image on posts
        Post::select('id', 'title', 'cover_image', 'og_image', 'content', 'content_en')
            ->get()
            ->each(function (Post $post) use (&$map) {
                foreach (['cover_image', 'og_image'] as $field) {
                    $url = $post->{$field};
                    if ($url) {
                        $map[$url][] = [
                            'type'  => 'post',
                            'id'    => $post->id,
                            'title' => $post->title,
                            'field' => $field,
                        ];
                    }
                }

                // Check inside Tiptap JSON content for image URLs
                foreach (['content', 'content_en'] as $field) {
                    $raw = $post->{$field};
                    if (!$raw) continue;

                    $json = $raw;
                    preg_match_all('#https?://[^\s"\']+/storage/posts/[^\s"\']+#', $json, $matches);

                    foreach ($matches[0] as $url) {
                        $url = rtrim($url, '",}]');
                        $map[$url][] = [
                            'type'  => 'post',
                            'id'    => $post->id,
                            'title' => $post->title,
                            'field' => $field . ' (contenido)',
                        ];
                    }
                }
            });

        // Check affiliate logos
        Affiliate::select('id', 'name', 'logo')
            ->whereNotNull('logo')
            ->get()
            ->each(function (Affiliate $aff) use (&$map) {
                if ($aff->logo) {
                    $map[$aff->logo][] = [
                        'type'  => 'affiliate',
                        'id'    => $aff->id,
                        'title' => $aff->name,
                        'field' => 'logo',
                    ];
                }
            });

        // Deduplicate usage entries
        foreach ($map as $url => $entries) {
            $map[$url] = collect($entries)->unique(fn ($e) => $e['type'] . $e['id'] . $e['field'])->values()->all();
        }

        return $map;
    }
}
