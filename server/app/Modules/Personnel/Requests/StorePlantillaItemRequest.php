<?php

namespace App\Modules\Personnel\Requests;

use App\Modules\Personnel\Enums\PlantillaStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePlantillaItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_number'       => ['required', 'string', 'max:255', 'unique:plantilla_items,item_number'],
            'position_title'    => ['required', 'string', 'max:255'],
            'salary_grade'      => ['required', 'integer', 'between:1,33'],
            'status'            => ['required', Rule::enum(PlantillaStatus::class)],
            'employee_id'       => ['nullable', 'exists:employees,id'],
            'office_assignment' => ['nullable', 'string', 'max:255'],
        ];
    }
}
