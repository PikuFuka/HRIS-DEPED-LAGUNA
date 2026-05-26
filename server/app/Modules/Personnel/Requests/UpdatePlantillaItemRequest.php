<?php

namespace App\Modules\Personnel\Requests;

use App\Modules\Personnel\Enums\PlantillaStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePlantillaItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $itemId = $this->route('plantilla_item');

        return [
            'item_number'       => ['sometimes', 'required', 'string', 'max:255', Rule::unique('plantilla_items', 'item_number')->ignore($itemId)],
            'position_title'    => ['sometimes', 'required', 'string', 'max:255'],
            'salary_grade'      => ['sometimes', 'required', 'integer', 'between:1,33'],
            'status'            => ['sometimes', 'required', Rule::enum(PlantillaStatus::class)],
            'employee_id'       => ['nullable', 'exists:employees,id'],
            'office_assignment' => ['nullable', 'string', 'max:255'],
        ];
    }
}
