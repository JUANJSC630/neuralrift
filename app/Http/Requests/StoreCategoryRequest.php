<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100|unique:categories,name',
            'name_en' => 'nullable|string|max:100',
            'color' => 'required|string|max:7',
            'icon' => 'nullable|string|max:10',
            'order' => 'integer|min:0',
            'description' => 'nullable|string|max:500',
            'description_en' => 'nullable|string|max:500',
        ];
    }
}
