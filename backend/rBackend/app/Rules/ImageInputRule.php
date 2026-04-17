<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

class ImageInputRule implements ValidationRule
{
    public function __construct(
        private readonly int $maxKilobytes = 2048
    ) {
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if ($value instanceof UploadedFile) {
            $this->validateUploadedFile($value, $fail);

            return;
        }

        if (is_string($value)) {
            $this->validateStringValue($value, $fail);

            return;
        }

        $fail("The {$attribute} must be an image file or image URL.");
    }

    private function validateUploadedFile(UploadedFile $file, Closure $fail): void
    {
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        $extension = strtolower($file->getClientOriginalExtension());

        if (! in_array($extension, $allowed, true)) {
            $fail('The image must be a file of type: jpg, jpeg, png, webp.');

            return;
        }

        $maxBytes = $this->maxKilobytes * 1024;

        if ($file->getSize() > $maxBytes) {
            $fail("The image may not be greater than {$this->maxKilobytes} kilobytes.");
        }
    }

    private function validateStringValue(string $value, Closure $fail): void
    {
        $value = trim($value);

        if ($value === '') {
            return;
        }

        if (mb_strlen($value) > 2048) {
            $fail('The image value is too long.');

            return;
        }

        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return;
        }

        $normalized = ltrim(str_replace('\\', '/', $value), '/');

        if (str_starts_with($normalized, 'public/')) {
            $normalized = substr($normalized, 7);
        }

        if ($normalized === '') {
            return;
        }

        if (str_starts_with($normalized, 'assets/') || str_starts_with($normalized, 'images/')) {
            return;
        }

        if (preg_match('/^[A-Za-z0-9_\-\/\.]+\.(jpg|jpeg|png|webp)$/i', $normalized) === 1) {
            return;
        }

        $fail('The image must be a valid image URL, uploaded file, or image path.');
    }
}
