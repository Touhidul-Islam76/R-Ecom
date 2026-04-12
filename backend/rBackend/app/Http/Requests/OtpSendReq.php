<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use App\Http\Requests\helpers\ApiFormRequest;
use Illuminate\Validation\Validator;

class OtpSendReq extends ApiFormRequest
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
            'phone' => [
                'nullable',
                'string',
                'max:20',
                'required_without:email',
            ],
            'email' => [
                'nullable',
                'string',
                'email',
                'max:255',
                'required_without:phone',
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($this->filled('phone') && $this->filled('email')) {
                $validator->errors()->add('phone', 'Use either phone or email, not both.');
                $validator->errors()->add('email', 'Use either phone or email, not both.');
            }
        });
    }
}
