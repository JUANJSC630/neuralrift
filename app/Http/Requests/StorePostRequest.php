<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'slug' => 'required|string|max:255|unique:posts,slug',
            'slug_en' => 'nullable|string|max:255|unique:posts,slug_en',
            'excerpt' => 'nullable|string|max:500',
            'excerpt_en' => 'nullable|string|max:500',
            'content' => 'required',
            'content_en' => 'nullable',
            'cover_image' => 'nullable|string|max:500',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:draft,published,archived',
            'lang' => 'required|in:es,en,both',
            'featured' => 'boolean',
            'published_at' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'affiliates' => 'nullable|array',
            'affiliates.*' => 'exists:affiliates,id',
        ];
    }
}
