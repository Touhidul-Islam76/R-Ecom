<?php

namespace App\Models;

use App\Models\Concerns\HandlesImageInput;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HandlesImageInput, SoftDeletes;

    protected string $imageFolder = 'categories';

    protected $fillable = ['name', 'slug', 'parent_id', 'image', 'is_active'];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
