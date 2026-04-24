<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        $categoryId = $this->route('category')->id ?? $this->route('category');

        return [
            'name' => ['required', 'string', 'max:100', Rule::unique('categories', 'name')->ignore($categoryId)],
            'name_en' => 'nullable|string|max:100',
            'color' => 'required|string|max:7',
            'icon' => 'nullable|string|max:10',
            'order' => 'integer|min:0',
            'description' => 'nullable|string|max:500',
            'description_en' => 'nullable|string|max:500',
        ];
    }
}
