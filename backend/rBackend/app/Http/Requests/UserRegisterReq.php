<?php

namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use App\Http\Requests\helpers\ApiFormRequest;

class UserRegisterReq extends ApiFormRequest
{
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
            'name' => ['required', 'string', 'max:255'],
            'phone' => [
                'nullable',
                'string',
                'max:20',
                'required_without:email',
                'unique:users,phone',
            ],
            'email' => [
                'nullable',
                'string',
                'email',
                'max:255',
                'required_without:phone',
                'unique:users,email',
            ],
            'password' => ['required', 'string', 'min:8'],
        ];
    }

}
   
