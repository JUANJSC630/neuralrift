<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GeneratePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'post_type'       => ['required', 'in:news,tutorial,review'],
            'topic'           => ['required', 'string', 'min:10', 'max:500'],
            'source_url'      => ['nullable', 'url', 'max:2000'],
            'lang'            => ['required', 'in:es,en,both'],
            'level'           => ['nullable', 'in:basico,intermedio,avanzado'],
            'tone'            => ['nullable', 'in:tecnico,accesible,opinion'],
            'category_id'     => ['nullable', 'exists:categories,id'],
            'affiliate_id'    => ['nullable', 'exists:affiliates,id'],
            'personal_rating' => ['nullable', 'numeric', 'min:1', 'max:5'],
            'extra_notes'     => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'topic.min' => 'El tema debe tener al menos 10 caracteres para generar contenido de calidad.',
            'topic.max' => 'El tema es demasiado largo. Máximo 500 caracteres.',
            'lang.in'   => 'El idioma debe ser: es, en o both.',
        ];
    }
}
