<?php

namespace App\Modules\Personnel\Controllers;

use App\Modules\Personnel\Enums\EmploymentType;
use App\Modules\Personnel\Enums\PlantillaStatus;
use App\Modules\Personnel\Requests\StorePlantillaRequest;
use App\Modules\Personnel\Requests\StoreNonPlantillaRequest;
use App\Modules\Personnel\Models\Employee;
use App\Modules\Personnel\Models\ItemHistory;
use App\Modules\Personnel\Models\PlantillaItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class EmployeeController extends \App\Http\Controllers\Controller
{
    public function storePlantilla(StorePlantillaRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $employee = DB::transaction(function () use ($validated, $request) {
            $employeeId = $validated['employee_id'];

            // Upload files
            $pdsPath        = $request->file('pds_file')->storeAs("documents/{$employeeId}", 'pds.pdf', 'public');
            $oathPath       = $request->file('oath_of_office_file')->storeAs("documents/{$employeeId}", 'oath.pdf', 'public');
            $assumptionPath = $request->file('assumption_of_duty_file')->storeAs("documents/{$employeeId}", 'assumption.pdf', 'public');

            $employee = Employee::create([
                'employee_id'                  => $validated['employee_id'],
                'first_name'                   => $validated['first_name'],
                'middle_name'                  => $validated['middle_name'] ?? null,
                'last_name'                    => $validated['last_name'],
                'suffix'                       => $validated['suffix'] ?? null,
                'sex'                          => $validated['sex'],
                'dob'                          => $validated['dob'],
                'civil_service_eligibility'    => $validated['civil_service_eligibility'] ?? null,
                'tin'                          => $validated['tin'] ?? null,
                'gsis'                         => $validated['gsis'] ?? null,
                'station_id'                   => $validated['station_id'] ?? null,
                'employment_type'              => EmploymentType::Plantilla,
                'pds_file_path'                => $pdsPath,
                'oath_of_office_file_path'     => $oathPath,
                'assumption_of_duty_file_path' => $assumptionPath,
            ]);

            // Assign to Plantilla Item
            $plantillaItem = PlantillaItem::findOrFail($validated['plantilla_item_id']);

            $plantillaItem->update([
                'employee_id' => $employee->id,
                'status'      => PlantillaStatus::Filled,
            ]);

            // Create History Record
            ItemHistory::create([
                'plantilla_item_id'  => $plantillaItem->id,
                'past_employee_name' => $employee->full_name,
                'start_date'         => now(),
                'status'             => 'active_holder',
            ]);

            return $employee;
        });

        return response()->json($employee->load('plantillaItem'), 201);
    }

    public function storeNonPlantilla(StoreNonPlantillaRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $employeeId = $validated['employee_id'];
        $pdsPath    = $request->file('pds_file')->storeAs("documents/{$employeeId}", 'pds.pdf', 'public');

        $employee = Employee::create([
            'employee_id'               => $validated['employee_id'],
            'first_name'                => $validated['first_name'],
            'middle_name'               => $validated['middle_name'] ?? null,
            'last_name'                 => $validated['last_name'],
            'suffix'                    => $validated['suffix'] ?? null,
            'sex'                       => $validated['sex'],
            'dob'                       => $validated['dob'],
            'tin'                       => $validated['tin'] ?? null,
            'station_id'                => $validated['station_id'] ?? null,
            'employment_type'           => $validated['employment_type'],
            'nature_of_work'            => $validated['nature_of_work'] ?? null,
            'monthly_salary'            => $validated['monthly_salary'] ?? null,
            'pds_file_path'             => $pdsPath,
        ]);

        return response()->json($employee, 201);
    }
}
