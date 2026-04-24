<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp',
        'image/svg+xml' => 'svg',
    ];

    private const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

    public function image(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|string',
            'filename' => 'required|string|max:255',
        ]);

        // Expect a data URI: data:image/jpeg;base64,<data>
        if (! preg_match('/^data:(image\/[a-z+]+);base64,(.+)$/s', $request->image, $m)) {
            return response()->json(['message' => 'Formato de imagen inválido.'], 422);
        }

        $mime = $m[1];
        $ext = self::ALLOWED_MIME_TYPES[$mime] ?? null;

        if (! $ext) {
            return response()->json(['message' => 'Tipo de imagen no permitido.'], 422);
        }

        $binary = base64_decode($m[2], strict: true);

        if ($binary === false || strlen($binary) > self::MAX_BYTES) {
            return response()->json(['message' => 'Imagen inválida o superior a 10 MB.'], 422);
        }

        $slug = Str::slug(pathinfo($request->filename, PATHINFO_FILENAME)) ?: 'image';
        $path = 'posts/'.now()->format('Y/m').'/'.$slug.'-'.uniqid().'.'.$ext;

        $disk = config('filesystems.media');
        Storage::disk($disk)->put($path, $binary, 'public');

        return response()->json([
            'url' => $disk === 'public'
                ? asset("storage/{$path}")
                : Storage::disk($disk)->url($path),
        ]);
    }
}
