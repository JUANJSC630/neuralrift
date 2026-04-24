<?php

namespace App\Http\Controllers;

use App\Actions\Analytics\RecordPostViewAction;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostViewController extends Controller
{
    public function __construct(
        private readonly RecordPostViewAction $recordView,
    ) {}

    public function store(Post $post, Request $request): JsonResponse
    {
        $counted = $this->recordView->execute($post, $request);

        return response()->json(['counted' => $counted]);
    }
}
