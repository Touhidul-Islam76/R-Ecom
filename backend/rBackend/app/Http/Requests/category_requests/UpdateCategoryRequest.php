<?php

namespace App\Http\Requests\category_requests;

use App\Rules\ImageInputRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateCategoryRequest extends FormRequest
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
        $categoryId = $this->route('category')?->id ?? $this->route('category');

        return [
            'name' => ['sometimes', 'string', 'max:120'],
            'slug' => ['sometimes', 'string', 'max:150', Rule::unique('categories', 'slug')->ignore($categoryId)],
            'parent_id' => ['nullable', 'integer', 'exists:categories,id', 'different:' . $categoryId],
            'image' => ['nullable', new ImageInputRule(2048)],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
