<?php

namespace App\Http\Requests\brand_requests;

use App\Rules\ImageInputRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateBrandRequest extends FormRequest
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
        $brandId = $this->route('brand')?->id ?? $this->route('brand');

        return [
            'name' => ['sometimes', 'string', 'max:120', Rule::unique('brands', 'name')->ignore($brandId)],
            'slug' => ['sometimes', 'string', 'max:150', Rule::unique('brands', 'slug')->ignore($brandId)],
            'image' => ['nullable', new ImageInputRule(2048)],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
