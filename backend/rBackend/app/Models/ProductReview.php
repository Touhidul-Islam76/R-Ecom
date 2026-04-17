<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductReview extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'rating',
        'title',
        'comment',
        'is_approved',
        'verified_purchase',
        'helpful_count',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'decimal:1',
            'is_approved' => 'boolean',
            'verified_purchase' => 'boolean',
            'helpful_count' => 'integer',
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
