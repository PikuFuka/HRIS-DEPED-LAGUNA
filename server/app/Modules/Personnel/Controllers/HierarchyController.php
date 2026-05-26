<?php

namespace App\Modules\Personnel\Controllers;

use Illuminate\Http\Request;

use App\Modules\Personnel\Models\Employee;

class HierarchyController extends \App\Http\Controllers\Controller
{
    public function index()
    {
        // Get root employees (those without a supervisor)
        $hierarchy = Employee::with('subordinates', 'plantillaItem')
            ->whereNull('supervisor_id')
            ->get();
            
        return response()->json($hierarchy);
    }
}
