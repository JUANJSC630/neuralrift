<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        $postId = $this->route('post')->id ?? $this->route('post');

        return [
            'title' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'slug' => ['required', 'string', 'max:255', Rule::unique('posts', 'slug')->ignore($postId)],
            'slug_en' => ['nullable', 'string', 'max:255', Rule::unique('posts', 'slug_en')->ignore($postId)],
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
