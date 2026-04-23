<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function image(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        $disk = config('filesystems.media');

        $path = $request->file('image')->store(
            'posts/' . now()->format('Y/m'),
            $disk
        );

        return response()->json([
            // For the local public disk, asset() resolves relative to the current
            // request host (works with any dev domain). For cloud disks (r2, s3)
            // Storage::url() returns the correct CDN URL.
            'url' => $disk === 'public'
                ? asset("storage/{$path}")
                : Storage::disk($disk)->url($path),
        ]);
    }
}
