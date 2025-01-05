<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNodeRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:256',
            ],
            'full_name' => [
                'required',
                'string',
                'max:1042',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'is_deleted' => [
                'required',
                'boolean',
            ],
        ];
    }
}
