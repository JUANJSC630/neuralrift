<?php

namespace App\Http\Resources;

use App\Models\Affiliate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Affiliate */
class AffiliateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'slug'             => $this->slug,
            'url'              => $this->url,
            'website'          => $this->website,
            'description'      => $this->description,
            'commission'       => $this->commission,
            'commission_type'  => $this->commission_type,
            'commission_value' => $this->commission_value,
            'cookie_duration'  => $this->cookie_duration,
            'pros'             => $this->pros,
            'cons'             => $this->cons,
            'rating'           => $this->rating,
            'category'         => $this->category,
            'badge'            => $this->badge,
            'featured'         => $this->featured,
            'active'           => $this->active,
            'logo'             => $this->logo,
        ];
    }
}
