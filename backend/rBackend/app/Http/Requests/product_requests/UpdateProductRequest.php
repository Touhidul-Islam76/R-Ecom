<?php

namespace App\Http\Requests\product_requests;

use App\Rules\ImageInputRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
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
        $productId = $this->route('product')?->id ?? $this->route('product');

        return [
            'title' => ['sometimes', 'string', 'max:200'],
            'slug' => ['sometimes', 'string', 'max:220', Rule::unique('products', 'slug')->ignore($productId)],
            'short_description' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'image' => ['nullable', new ImageInputRule(2048)],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'is_active' => ['sometimes', 'boolean'],

            'variants' => ['sometimes', 'array', 'min:1'],
            'variants.*.size' => ['required_with:variants', 'in:S,M,L,XL,XXL'],
            'variants.*.color' => ['required_with:variants', 'string', 'max:60'],
            'variants.*.quantity' => ['required_with:variants', 'integer', 'min:0'],
            'variants.*.price' => ['required_with:variants', 'numeric', 'min:0'],
            'variants.*.discount_price' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
