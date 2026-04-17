<?php

namespace App\Models;

use App\Models\Concerns\HandlesImageInput;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use HandlesImageInput, SoftDeletes;

    protected string $imageFolder = 'brands';

    protected $fillable = ['name', 'slug', 'image', 'is_active'];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
