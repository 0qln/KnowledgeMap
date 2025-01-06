<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Edge extends Model
{
    /** @use HasFactory<\Database\Factories\EdgeFactory> */
    use HasFactory;

    protected $fillable = ['id_origin', 'id_target', 'description', 'weight'];

    /**
     * Get the target node for this edge.
     */
    public function target(): BelongsTo
    {
        return $this->belongsTo(Node::class, 'id_target');
    }

    /**
     * Get the origin node for this edge.
     */
    public function origin(): BelongsTo
    {
        return $this->belongsTo(Node::class, 'id_origin');
    }
}
