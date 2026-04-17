<?php

namespace App\Models\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

trait HandlesImageInput
{
    public function getImageUrlAttribute(): string
    {
        $image = $this->attributes['image'] ?? null;

        if (! is_string($image) || trim($image) === '') {
            return asset($this->resolveDefaultImageAssetPath());
        }

        $image = trim($image);

        if (filter_var($image, FILTER_VALIDATE_URL)) {
            return $image;
        }

        $normalizedPath = $this->normalizeImagePath($image);

        if (! File::exists(public_path($normalizedPath))) {
            return asset($this->resolveDefaultImageAssetPath());
        }

        return asset($normalizedPath);
    }

    public function setImageAttribute(mixed $value): void
    {
        if ($value instanceof UploadedFile) {
            $directory = public_path($this->getImageStorageDirectory());

            if (! File::isDirectory($directory)) {
                File::makeDirectory($directory, 0755, true);
            }

            $filename = strtolower(class_basename($this)).'_'.now()->format('YmdHis').'_'.Str::random(10).'.'.$value->getClientOriginalExtension();
            $value->move($directory, $filename);

            $this->attributes['image'] = $this->getImageStorageDirectory().'/'.$filename;

            return;
        }

        if (is_string($value)) {
            $value = trim($value);
            $this->attributes['image'] = $value === '' ? null : $this->normalizeImagePath($value);

            return;
        }

        $this->attributes['image'] = null;
    }

    protected function getImageStorageDirectory(): string
    {
        return 'assets/images/'.$this->getImageFolderName();
    }

    protected function getImageFolderName(): string
    {
        return property_exists($this, 'imageFolder') ? $this->imageFolder : Str::kebab(class_basename($this));
    }

    protected function resolveDefaultImageAssetPath(): string
    {
        $preferred = 'assets/default/profile4.jpg';

        if (File::exists(public_path($preferred))) {
            return $preferred;
        }

        $fallback = 'assets/images/default/profile4.jpg';

        if (File::exists(public_path($fallback))) {
            return $fallback;
        }

        return $preferred;
    }

    protected function normalizeImagePath(string $value): string
    {
        $value = str_replace('\\', '/', trim($value));
        $value = ltrim($value, '/');

        if (str_starts_with($value, 'public/')) {
            $value = substr($value, 7);
        }

        if ($value === '') {
            return $this->resolveDefaultImageAssetPath();
        }

        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        if (str_starts_with($value, 'assets/')) {
            return $value;
        }

        if (str_starts_with($value, 'images/')) {
            return 'assets/'.$value;
        }

        if (str_starts_with($value, $this->getImageFolderName().'/')) {
            return 'assets/images/'.$value;
        }

        if (str_contains($value, '/')) {
            return 'assets/images/'.$value;
        }

        return $this->getImageStorageDirectory().'/'.$value;
    }
}
