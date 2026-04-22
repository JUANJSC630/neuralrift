<?php

namespace App\Http\Resources;

use App\Models\Affiliate;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Post */
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'title_en'      => $this->title_en,
            'slug'          => $this->slug,
            'slug_en'       => $this->slug_en,
            'excerpt'       => $this->excerpt,
            'excerpt_en'    => $this->excerpt_en,
            'content'       => $this->content,
            'content_en'    => $this->content_en,
            'cover_image'   => $this->cover_image,
            'status'        => $this->status,
            'lang'          => $this->lang,
            'featured'      => $this->featured,
            'views_count'   => $this->views_count,
            'read_time'     => $this->read_time,
            'published_at'  => $this->published_at?->toISOString(),
            'created_at'    => $this->created_at->toISOString(),
            'category'      => new CategoryResource($this->whenLoaded('category')),
            'author'        => $this->whenLoaded('author', fn () => [
                'id'   => $this->author->id,
                'name' => $this->author->name,
            ]),
            'tags' => $this->whenLoaded('tags', fn () =>
                $this->tags->map(fn (Tag $t) => ['id' => $t->id, 'name' => $t->name, 'slug' => $t->slug])->values() // @phpstan-ignore argument.type
            ),
            'affiliates' => $this->whenLoaded('affiliates', fn () =>
                $this->affiliates->map(fn (Affiliate $a) => ['id' => $a->id, 'name' => $a->name])->values() // @phpstan-ignore argument.type
            ),
        ];
    }
}
