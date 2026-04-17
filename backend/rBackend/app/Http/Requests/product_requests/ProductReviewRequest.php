<?php

namespace App\Http\Requests\product_requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
        * @return array<string, array<mixed>|string>
     */
    public function rules(): array
    {
        $isModerator = in_array((string) $this->user()?->role, ['admin', 'superAdmin', 'moderator'], true);

        if ($this->isMethod('POST')) {
            return [
                'rating' => ['required', 'numeric', 'min:1', 'max:5'],
                'title' => ['nullable', 'string', 'max:255'],
                'comment' => ['nullable', 'string', 'max:3000'],
                'is_approved' => ['prohibited'],
                'verified_purchase' => ['prohibited'],
                'helpful_count' => ['prohibited'],
            ];
        }

        $rules = [
            'rating' => ['sometimes', 'numeric', 'min:1', 'max:5'],
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'comment' => ['sometimes', 'nullable', 'string', 'max:3000'],
        ];

        if ($isModerator) {
            $rules['is_approved'] = ['sometimes', 'boolean'];
            $rules['verified_purchase'] = ['sometimes', 'boolean'];
            $rules['helpful_count'] = ['sometimes', 'integer', 'min:0'];
        } else {
            $rules['is_approved'] = ['prohibited'];
            $rules['verified_purchase'] = ['prohibited'];
            $rules['helpful_count'] = ['prohibited'];
        }

        return $rules;
    }
}
