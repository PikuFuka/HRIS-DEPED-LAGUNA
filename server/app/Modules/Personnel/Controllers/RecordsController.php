<?php

namespace App\Modules\Personnel\Controllers;

use App\Modules\Personnel\Enums\EmploymentType;
use App\Modules\Personnel\Models\Employee;
use Illuminate\Http\JsonResponse;

class RecordsController extends \App\Http\Controllers\Controller
{
    public function plantilla(): JsonResponse
    {
        $records = Employee::with('plantillaItem')
            ->where('employment_type', EmploymentType::Plantilla)
            ->paginate(25);

        return response()->json($records);
    }

    public function nonPlantilla(): JsonResponse
    {
        $records = Employee::where('employment_type', EmploymentType::NonPlantilla)
            ->paginate(25);

        return response()->json($records);
    }
}
