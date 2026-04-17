<?php

namespace App\Http\Requests\product_requests;

use App\Rules\ImageInputRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:220', 'unique:products,slug'],
            'short_description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'image' => ['nullable', new ImageInputRule(2048)],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'is_active' => ['sometimes', 'boolean'],

            'variants' => ['required', 'array', 'min:1'],
            'variants.*.size' => ['required', 'in:S,M,L,XL,XXL'],
            'variants.*.color' => ['required', 'string', 'max:60'],
            'variants.*.quantity' => ['required', 'integer', 'min:0'],
            'variants.*.price' => ['required', 'numeric', 'min:0'],
            'variants.*.discount_price' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
