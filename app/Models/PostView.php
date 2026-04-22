<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostView extends Model
{
    public $timestamps = false;

    protected $table = 'post_views';

    protected $fillable = ['post_id', 'ip', 'country', 'source', 'referrer', 'viewed_at'];

    protected $casts = ['viewed_at' => 'datetime'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
