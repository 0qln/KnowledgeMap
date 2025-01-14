<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEdgeRequest extends FormRequest
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
            'description' => [ 'nullable', 'string', 'max:1024' ],
            'weight' => [ 'required', 'integer' ],
            'id_target' => [ 'required', 'integer', 'exists:nodes,id' ],
            'id_origin' => [ 'required', 'integer', 'exists:nodes,id' ],
        ];
    }
}
