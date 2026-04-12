<?php

namespace App\Http\Requests\helpers;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use App\helpers\ApiResponseTrait;
use Illuminate\Http\Exceptions\HttpResponseException;

class ApiFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    use ApiResponseTrait;

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->errorResponse(
                'Validation failed',
                422,
                $validator->errors()->toArray()
            )
        );
    }
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
        ];
    }
}
