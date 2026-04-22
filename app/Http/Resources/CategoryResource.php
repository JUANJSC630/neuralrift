<?php

namespace App\Http\Resources;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Category */
class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'name_en'     => $this->name_en,
            'slug'        => $this->slug,
            'color'       => $this->color,
            'icon'        => $this->icon,
            'order'       => $this->order,
            'description' => $this->description,
            'posts_count' => $this->whenCounted('posts'),
        ];
    }
}
