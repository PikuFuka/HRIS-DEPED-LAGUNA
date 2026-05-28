<?php

namespace App\Modules\Recruitment\Controllers;

use Illuminate\Http\Request;
use App\Modules\Recruitment\Models\Vacancy;

class VacancyController extends \App\Http\Controllers\Controller
{
    public function index()
    {
        $paginated = Vacancy::with('plantillaItem')->latest()->paginate(1000);

        // Transform to match frontend Vacancy interface
        $paginated->getCollection()->transform(fn ($v) => $this->transformVacancy($v));

        return response()->json($paginated);
    }

    public function show(Vacancy $vacancy)
    {
        return response()->json($this->transformVacancy($vacancy->load('plantillaItem')));
    }

    public function store(Request $request)
    {
        // Accept both frontend-style and backend-style field names
        $data = $request->all();

        // If coming from the frontend with 'title', map to plantilla item lookup
        if (isset($data['title']) && !isset($data['plantilla_item_id'])) {
            $validated = $request->validate([
                'title'    => 'required|string',
                'status'   => 'nullable|string|in:Draft,Published,Closed,Pending CSC',
                'deadline' => 'nullable|date',
                'itemNo'   => 'nullable|string',
                'qualificationEducation'   => 'nullable|string',
                'qualificationExperience'  => 'nullable|string',
                'qualificationTraining'    => 'nullable|string',
                'qualificationEligibility' => 'nullable|string',
            ]);

            $plantillaItem = null;
            if (!empty($validated['itemNo']) && $validated['itemNo'] !== 'N/A') {
                $plantillaItem = \App\Modules\Personnel\Models\PlantillaItem::where('item_number', $validated['itemNo'])->first();
            }

            $vacancy = Vacancy::create([
                'plantilla_item_id' => $plantillaItem ? $plantillaItem->id : null,
                'status'       => $validated['status'] ?? 'Draft',
                'posting_date' => now()->format('Y-m-d'),
                'closing_date' => $validated['deadline'] ?? null,
                'education'    => $validated['qualificationEducation'] ?? null,
                'experience'   => $validated['qualificationExperience'] ?? null,
                'training'     => $validated['qualificationTraining'] ?? null,
                'eligibility'  => $validated['qualificationEligibility'] ?? null,
            ]);

            // If an item was linked, ensure it has NO active holder.
            if ($plantillaItem) {
                $plantillaItem->update([
                    'status' => 'unfilled',
                    'employee_id' => null
                ]);
                // Remove the active holder (employee) for this item
                \App\Modules\Personnel\Models\Employee::where('plantilla_item_id', $plantillaItem->id)->delete();
            } else if (!empty($validated['itemNo']) && $validated['itemNo'] !== 'N/A') {
                // If it's a non-plantilla or we just have an identifier like "N/A" or "NP-xxx", 
                // and they entered a specific employee ID or nature of work?
                // The user requested: "if the non plantilla is in vacancies it should not have active holder"
                // Assuming they might type the employee_id or nature of work as the itemNo for non-plantilla.
                \App\Modules\Personnel\Models\Employee::where('employee_id', $validated['itemNo'])
                    ->orWhere('nature_of_work', $validated['title'])
                    ->where('employment_type', 'non-plantilla')
                    ->delete();
            }

            return response()->json($this->transformVacancy($vacancy->load('plantillaItem')), 201);
        }

        // Standard API validation
        $validated = $request->validate([
            'plantilla_item_id' => 'required|exists:plantilla_items,id',
            'status' => 'required|string|in:Draft,Published,Closed',
            'posting_date' => 'nullable|date',
            'closing_date' => 'nullable|date',
            'education' => 'nullable|string',
            'experience' => 'nullable|string',
            'training' => 'nullable|string',
            'eligibility' => 'nullable|string',
        ]);

        $vacancy = Vacancy::create($validated);
        return response()->json($this->transformVacancy($vacancy->load('plantillaItem')), 201);
    }

    public function update(Request $request, Vacancy $vacancy)
    {
        $data = $request->all();

        // Handle frontend-style fields
        $updateData = [];
        if (isset($data['status'])) $updateData['status'] = $data['status'];
        if (isset($data['deadline'])) $updateData['closing_date'] = $data['deadline'];
        if (isset($data['qualificationEducation'])) $updateData['education'] = $data['qualificationEducation'];
        if (isset($data['qualificationExperience'])) $updateData['experience'] = $data['qualificationExperience'];
        if (isset($data['qualificationTraining'])) $updateData['training'] = $data['qualificationTraining'];
        if (isset($data['qualificationEligibility'])) $updateData['eligibility'] = $data['qualificationEligibility'];

        // Also accept backend-style fields
        if (isset($data['posting_date'])) $updateData['posting_date'] = $data['posting_date'];
        if (isset($data['closing_date'])) $updateData['closing_date'] = $data['closing_date'];
        if (isset($data['education'])) $updateData['education'] = $data['education'];
        if (isset($data['experience'])) $updateData['experience'] = $data['experience'];
        if (isset($data['training'])) $updateData['training'] = $data['training'];
        if (isset($data['eligibility'])) $updateData['eligibility'] = $data['eligibility'];

        $vacancy->update($updateData);
        return response()->json($this->transformVacancy($vacancy->load('plantillaItem')));
    }

    public function destroy(Vacancy $vacancy)
    {
        $vacancy->delete();
        return response()->json(null, 204);
    }

    public function publicList()
    {
        $vacancies = Vacancy::with('plantillaItem')
            ->where('status', 'Published')
            ->get()
            ->map(fn ($v) => $this->transformVacancy($v));

        return response()->json($vacancies);
    }

    /**
     * Transform a Vacancy model to match the frontend Vacancy interface.
     */
    private function transformVacancy(Vacancy $vacancy): array
    {
        $item = $vacancy->plantillaItem;
        return [
            'id'       => $vacancy->id,
            'title'    => $item?->position_title ?? 'Position TBD',
            'status'   => $vacancy->status ?? 'Draft',
            'deadline' => $vacancy->closing_date?->format('Y-m-d') ?? $vacancy->closing_date ?? 'Open',
            'itemNo'   => $item?->item_number ?? 'N/A',
            'type'     => 'plantilla',
            'salaryGrade' => $item ? 'SG-' . $item->salary_grade : null,
            'monthlySalary' => $item?->authorized_salary ? '₱' . number_format($item->authorized_salary, 2) : null,
            'qualificationEducation'   => $vacancy->education,
            'qualificationExperience'  => $vacancy->experience,
            'qualificationTraining'    => $vacancy->training,
            'qualificationEligibility' => $vacancy->eligibility,
            'bureauService'  => $item?->office_assignment,
            'divisionUnit'   => 'Division of Laguna',
            'posting_date'   => $vacancy->posting_date,
            'closing_date'   => $vacancy->closing_date,
        ];
    }
}
