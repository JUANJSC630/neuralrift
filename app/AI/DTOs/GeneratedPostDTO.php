<?php

namespace App\AI\DTOs;

readonly class GeneratedPostDTO
{
    public function __construct(
        public string  $title,
        public string  $titleEn,
        public string  $slug,
        public string  $slugEn,
        public string  $excerpt,
        public string  $excerptEn,
        public string  $contentJson,
        public string  $contentEnJson,
        public string  $metaTitle,
        public string  $metaTitleEn,
        public string  $metaDescription,
        public string  $metaDescriptionEn,
        public ?int    $categoryId,
        public array   $suggestedTags,
        public ?int    $affiliateId,
        public string  $lang,
        public int     $estimatedReadTime,
        public string  $postType,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            title:              $data['title']               ?? '',
            titleEn:            $data['title_en']            ?? '',
            slug:               str($data['title'] ?? '')->slug()->value(),
            slugEn:             str($data['title_en'] ?? '')->slug()->value(),
            excerpt:            $data['excerpt']             ?? '',
            excerptEn:          $data['excerpt_en']          ?? '',
            contentJson:        $data['content_json']        ?? '{}',
            contentEnJson:      $data['content_en_json']     ?? '{}',
            metaTitle:          $data['meta_title']          ?? '',
            metaTitleEn:        $data['meta_title_en']       ?? '',
            metaDescription:    $data['meta_description']    ?? '',
            metaDescriptionEn:  $data['meta_description_en'] ?? '',
            categoryId:         $data['category_id']         ?? null,
            suggestedTags:      $data['suggested_tags']      ?? [],
            affiliateId:        $data['affiliate_id']        ?? null,
            lang:               $data['lang']                ?? 'es',
            estimatedReadTime:  $data['estimated_read_time'] ?? 5,
            postType:           $data['post_type']           ?? 'tutorial',
        );
    }
}
