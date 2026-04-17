<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\File;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'phone',
        'email',
        'address',
        'district',
        'image',
        'password',
        'role',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'image_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'otp',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'otp' => 'integer',
            'otp_expires_at' => 'datetime',
        ];
    }

    public function getImageUrlAttribute(): string
    {
        $defaultImagePath = $this->resolveDefaultImagePath();

        if (empty($this->image)) {
            return asset('assets/images/'.$defaultImagePath);
        }

        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }

        $imagePath = str_replace('\\', '/', $this->image);
        $imagePath = ltrim($imagePath, '/');

        if (str_starts_with($imagePath, 'assets/images/')) {
            return asset($imagePath);
        }

        if (! str_contains($imagePath, '/')) {
            $imagePath = 'userProfile/'.$imagePath;
        }

        if (! File::exists(public_path('assets/images/'.$imagePath))) {
            return asset('assets/images/'.$defaultImagePath);
        }

        return asset('assets/images/'.$imagePath);
    }

    protected function resolveDefaultImagePath(): string
    {
        static $cachedDefaultImagePath = null;

        if ($cachedDefaultImagePath !== null) {
            return $cachedDefaultImagePath;
        }

        $defaultDirectory = public_path('assets/images/default');

        if (File::isDirectory($defaultDirectory)) {
            $defaultFiles = collect(File::files($defaultDirectory))
                ->sortBy(fn ($file) => $file->getFilename())
                ->values();

            $firstDefaultFile = $defaultFiles->first();

            if ($firstDefaultFile) {
                $cachedDefaultImagePath = 'default/'.$firstDefaultFile->getFilename();

                return $cachedDefaultImagePath;
            }
        }

        $cachedDefaultImagePath = 'default/profile4.jpg';

        return $cachedDefaultImagePath;
    }
    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function wishlistItems()
    {
        return $this->hasMany(WishlistItem::class);
    }

    public function wishlistProducts()
    {
        return $this->belongsToMany(Product::class, 'wishlist_items')->withTimestamps();
    }
}
