<?php

namespace App\Actions\AI;

use App\AI\DTOs\GeneratedPostDTO;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreatePostFromGeneratedContentAction
{
    public function execute(GeneratedPostDTO $dto, int $authorId): Post
    {
        return DB::transaction(function () use ($dto, $authorId) {
            $slug   = $this->makeUniqueSlug($dto->slug);
            $slugEn = $dto->slugEn ? $this->makeUniqueSlug($dto->slugEn, '_en') : null;

            $post = Post::create([
                'user_id'             => $authorId,
                'category_id'         => $dto->categoryId,
                'title'               => $dto->title,
                'title_en'            => $dto->titleEn ?: null,
                'slug'                => $slug,
                'slug_en'             => $slugEn,
                'excerpt'             => $dto->excerpt,
                'excerpt_en'          => $dto->excerptEn ?: null,
                'content'             => $dto->contentJson,
                'content_en'          => $dto->contentEnJson ?: null,
                'meta_title'          => $dto->metaTitle,
                'meta_title_en'       => $dto->metaTitleEn ?: null,
                'meta_description'    => $dto->metaDescription,
                'meta_description_en' => $dto->metaDescriptionEn ?: null,
                'status'              => 'review',
                'lang'                => $dto->lang,
                'featured'            => false,
                'allow_comments'      => true,
                'indexable'           => true,
            ]);

            if ($dto->affiliateId) {
                $post->affiliates()->attach($dto->affiliateId);
            }

            if (! empty($dto->suggestedTags)) {
                $tagIds = collect($dto->suggestedTags)
                    ->map(fn ($tagName) => Tag::firstOrCreate(
                        ['slug' => str($tagName)->slug()->value()],
                        ['name' => $tagName]
                    ))
                    ->pluck('id')
                    ->toArray();

                $post->tags()->attach($tagIds);
            }

            Log::info('CreatePostFromGeneratedContentAction: post created', [
                'post_id' => $post->id,
                'title'   => $post->title,
                'status'  => $post->status,
            ]);

            return $post;
        });
    }

    private function makeUniqueSlug(string $baseSlug, string $suffix = ''): string
    {
        $slug    = $baseSlug;
        $column  = $suffix === '_en' ? 'slug_en' : 'slug';
        $counter = 1;

        while (Post::where($column, $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
