<?php

namespace App\Modules\Personnel\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNonPlantillaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id'     => ['required', 'string', 'unique:employees,employee_id'],
            'first_name'      => ['required', 'string', 'max:255'],
            'middle_name'     => ['nullable', 'string', 'max:255'],
            'last_name'       => ['required', 'string', 'max:255'],
            'suffix'          => ['nullable', 'string', 'max:20'],
            'sex'             => ['required', 'string', 'in:male,female'],
            'dob'             => ['required', 'date'],
            'tin'             => ['nullable', 'string'],
            'station_id'      => ['nullable', 'string'],
            'employment_type' => ['required', 'string', 'in:non-plantilla'],
            'nature_of_work'  => ['nullable', 'string'],
            'monthly_salary'  => ['nullable', 'numeric', 'min:0'],
            'pds_file'        => ['required', 'file', 'mimes:pdf', 'max:5120'],
        ];
    }
}
