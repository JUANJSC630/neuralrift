<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AffiliateClick extends Model
{
    public $timestamps = false;

    protected $fillable = ['affiliate_id', 'post_id', 'ip', 'country', 'clicked_at'];

    protected $casts = ['clicked_at' => 'datetime'];

    public function affiliate(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
