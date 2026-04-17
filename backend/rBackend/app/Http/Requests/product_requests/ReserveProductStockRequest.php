<?php

namespace App\Http\Requests\product_requests;

use Illuminate\Foundation\Http\FormRequest;

class ReserveProductStockRequest extends FormRequest
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
        return [
            'size' => ['required', 'in:S,M,L,XL,XXL'],
            'color' => ['required', 'string', 'max:60'],
            'quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
