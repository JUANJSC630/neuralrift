<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAffiliateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        $affiliateId = $this->route('affiliate')->id ?? $this->route('affiliate');

        return [
            'name' => ['required', 'string', 'max:100', Rule::unique('affiliates', 'name')->ignore($affiliateId)],
            'url' => 'required|url|max:500',
            'website' => 'nullable|url|max:500',
            'description' => 'required|string|max:1000',
            'commission' => 'nullable|string|max:100',
            'commission_type' => 'nullable|in:one_time,recurring',
            'commission_value' => 'nullable|numeric|min:0',
            'cookie_duration' => 'nullable|string|max:50',
            'pros' => 'nullable|array',
            'pros.*' => 'string|max:200',
            'cons' => 'nullable|array',
            'cons.*' => 'string|max:200',
            'rating' => 'nullable|numeric|min:0|max:5',
            'category' => 'nullable|string|max:100',
            'badge' => 'nullable|string|max:50',
            'featured' => 'boolean',
            'active' => 'boolean',
            'logo' => 'nullable|string|max:500',
        ];
    }
}
