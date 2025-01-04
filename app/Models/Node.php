<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Node extends Model
{
    /** @use HasFactory<\Database\Factories\NodeFactory> */
    use HasFactory;

    protected $fillable = ['title', 'full_name', 'description', 'is_deleted'];

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
