<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UploadController extends Controller
{
    public function image(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        $path = $request->file('image')->store(
            'posts/' . now()->format('Y/m'),
            'public'
        );

        return response()->json([
            'url' => asset("storage/{$path}"),
        ]);
    }
}
