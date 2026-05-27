<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Auth\Models\User;
use App\Modules\Personnel\Models\Employee;
use App\Modules\Personnel\Models\PlantillaItem;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Modules\Personnel\Enums\Sex;
use App\Modules\Personnel\Enums\EmploymentType;
use App\Modules\Personnel\Enums\PlantillaStatus;

class EmployeeRegistrationController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validate the incoming massive payload
        $data = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'type' => 'required|string', // Should come from frontend indicating if it's plantilla
            
            // Personal
            'employeeNumber' => 'required|string|unique:employees,employee_id',
            'lastName' => 'required|string',
            'givenName' => 'required|string',
            'middleName' => 'nullable|string',
            'suffix' => 'nullable|string',
            'sex' => 'required|string|in:MALE,FEMALE',
            'birthDate' => 'required|date',
            'tin' => 'nullable|string',

            // Plantilla specific
            'itemNumber' => 'nullable|string|required_if:type,plantilla',
            'position' => 'nullable|string|required_if:type,plantilla',
            'positionParenthetical' => 'nullable|string',
            'reclassification' => 'nullable|string',
            'previousItemNumber' => 'nullable|string',
            'taggingOfItem' => 'nullable|string',
            'sg' => 'nullable|numeric',
            'step' => 'nullable|numeric',
            'authorized' => 'nullable|numeric',
            'actual' => 'nullable|numeric',
            'code' => 'nullable|string',
            'item_type' => 'nullable|string', // mapped from type in frontend
            'level' => 'nullable|string',
            'attri' => 'nullable|string',
            
            // Assignment / School
            'category' => 'nullable|string',
            'schoolId' => 'nullable|string',
            'schoolName' => 'nullable|string',
            'actualDeployment' => 'nullable|string',

            // Non-Plantilla specific
            'assignment' => 'nullable|string',
            'natureOfWork' => 'nullable|string',
            'monthlySalary' => 'nullable|numeric',
            'sourceOfFunds' => 'nullable|string',
            'contractDuration' => 'nullable|string',
            'statusOfEngagement' => 'nullable|string',

            // Professional
            'origAppt' => 'nullable|date',
            'lastProm' => 'nullable|date',
            'status' => 'nullable|string',
            'eligibility' => 'nullable|string',
            'firstDayOfService' => 'nullable|date',
        ]);

        try {
            DB::beginTransaction();

            // 2. Create User account
            $user = User::create([
                'name' => trim($data['givenName'] . ' ' . $data['lastName']),
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            // Assign a default role (e.g., Teacher/Employee)
            // $user->assignRole('Employee'); // Assuming roles exist. Let's not break it if role doesn't exist yet.

            // 3. Create Employee Profile
            $employeeTypeEnum = $request->type === 'plantilla' 
                ? EmploymentType::Plantilla
                : EmploymentType::NonPlantilla;

            $employee = Employee::create([
                'employee_id' => $data['employeeNumber'],
                'first_name' => $data['givenName'],
                'middle_name' => $data['middleName'],
                'last_name' => $data['lastName'],
                'suffix' => $data['suffix'],
                'sex' => $data['sex'] === 'MALE' ? Sex::MALE : Sex::FEMALE,
                'dob' => $data['birthDate'],
                'tin' => $data['tin'],
                'civil_service_eligibility' => $data['eligibility'],
                'employment_type' => $employeeTypeEnum,
                
                // Professional/Service
                'original_appointment_date' => $data['origAppt'] ?? null,
                'last_promotion_date' => $data['lastProm'] ?? null,
                'appointment_status' => $data['status'] ?? null,
                
                // Non-Plantilla specific
                'first_day_of_service' => $data['firstDayOfService'] ?? null,
                'status_of_engagement' => $data['statusOfEngagement'] ?? null,
                'contract_duration' => $data['contractDuration'] ?? null,
                'source_of_funds' => $data['sourceOfFunds'] ?? null,
                'monthly_salary' => $data['monthlySalary'] ?? null,
                'nature_of_work' => $data['natureOfWork'] ?? null,
                'station_id' => $data['assignment'] ?? $data['schoolId'] ?? null,
            ]);

            // 4. Create/Assign Plantilla Item if type is plantilla
            if ($request->type === 'plantilla' && !empty($data['itemNumber'])) {
                $item = PlantillaItem::firstOrNew(['item_number' => $data['itemNumber']]);
                
                $item->position_title = $data['position'];
                $item->salary_grade = $data['sg'] ?? 1;
                $item->status = PlantillaStatus::FILLED;
                $item->employee_id = $employee->id;
                
                // Detailed Plantilla fields
                $item->position_parenthetical = $data['positionParenthetical'] ?? null;
                $item->is_reclassified = ($data['reclassification'] === 'YES');
                $item->previous_item_number = $data['previousItemNumber'] ?? null;
                $item->tagging_of_item = $data['taggingOfItem'] ?? null;
                $item->step = $data['step'] ?? null;
                $item->authorized_salary = $data['authorized'] ?? null;
                $item->actual_salary = $data['actual'] ?? null;
                $item->code = $data['code'] ?? null;
                $item->type = $data['item_type'] ?? null;
                $item->level = $data['level'] ?? null;
                $item->attri = $data['attri'] ?? null;
                $item->category = $data['category'] ?? null;
                $item->school_id = $data['schoolId'] ?? null;
                $item->school_name = $data['schoolName'] ?? null;
                $item->actual_deployment = $data['actualDeployment'] ?? null;
                
                $item->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Registration successful.',
                'user' => $user,
                'employee' => $employee
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Employee registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Registration failed. Please try again or contact support.',
            ], 500);
        }
    }
}
