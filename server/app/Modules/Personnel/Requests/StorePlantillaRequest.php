<?php

namespace App\Modules\Personnel\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlantillaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id'               => ['required', 'string', 'unique:employees,employee_id'],
            'first_name'                => ['required', 'string', 'max:255'],
            'middle_name'               => ['nullable', 'string', 'max:255'],
            'last_name'                 => ['required', 'string', 'max:255'],
            'suffix'                    => ['nullable', 'string', 'max:20'],
            'sex'                       => ['required', 'string', 'in:male,female'],
            'dob'                       => ['required', 'date'],
            'civil_service_eligibility' => ['nullable', 'string'],
            'tin'                       => ['nullable', 'string'],
            'gsis'                      => ['nullable', 'string'],
            'station_id'                => ['nullable', 'string'],
            'plantilla_item_id'         => ['required', 'exists:plantilla_items,id'],
            'pds_file'                  => ['required', 'file', 'mimes:pdf', 'max:5120'],
            'oath_of_office_file'       => ['required', 'file', 'mimes:pdf', 'max:5120'],
            'assumption_of_duty_file'   => ['required', 'file', 'mimes:pdf', 'max:5120'],
        ];
    }
}
