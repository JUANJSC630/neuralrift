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
    private function mediaDisk(): string
    {
        return config('filesystems.media');
    }

    public function index(): Response
    {
        $disk = $this->mediaDisk();
        $images = $this->getAllImages();
        $usageMap = $this->buildUsageMap();

        $data = collect($images)->map(function (string $path) use ($usageMap, $disk) {
            $url = Storage::disk($disk)->url($path);

            // Match by path suffix to handle domain/URL mismatches
            $usedIn = $usageMap[$path] ?? [];

            return [
                'path'      => $path,
                'url'       => $url,
                'filename'  => basename($path),
                'size'      => Storage::disk($disk)->size($path),
                'modified'  => Storage::disk($disk)->lastModified($path),
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

        $disk = $this->mediaDisk();

        if (!Storage::disk($disk)->exists($path)) {
            return response()->json(['error' => 'Imagen no encontrada.'], 404);
        }

        Storage::disk($disk)->delete($path);

        return response()->json(['success' => true, 'message' => 'Imagen eliminada.']);
    }

    private function getAllImages(): array
    {
        $files = Storage::disk($this->mediaDisk())->allFiles('posts');

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
                        $path = self::extractRelativePath($url);
                        $map[$path][] = [
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
                    // Match both local /storage/posts/ and R2/S3 /posts/ URLs
                    preg_match_all('#https?://[^\s"\']+/(?:storage/)?posts/[^\s"\']+#', $json, $matches);

                    foreach ($matches[0] as $url) {
                        $url = rtrim($url, '",}]');
                        $path = self::extractRelativePath($url);
                        $map[$path][] = [
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
                    $path = self::extractRelativePath($aff->logo);
                    $map[$path][] = [
                        'type'  => 'affiliate',
                        'id'    => $aff->id,
                        'title' => $aff->name,
                        'field' => 'logo',
                    ];
                }
            });

        // Deduplicate usage entries
        foreach ($map as $path => $entries) {
            $map[$path] = collect($entries)->unique(fn ($e) => $e['type'] . $e['id'] . $e['field'])->values()->all();
        }

        return $map;
    }

    /**
     * Extract relative path (e.g. "posts/2026/04/file.png") from a full URL,
     * stripping domain and /storage/ prefix so matching is domain-agnostic.
     */
    private static function extractRelativePath(string $url): string
    {
        // Remove everything before /storage/posts/ or /posts/
        if (preg_match('#/storage/(posts/.+)$#', $url, $m)) {
            return $m[1];
        }
        if (preg_match('#/(posts/.+)$#', $url, $m)) {
            return $m[1];
        }

        return $url;
    }
}
