<?php

namespace App\Modules\Recruitment\Controllers;

use Illuminate\Http\Request;
use App\Modules\Recruitment\Models\Vacancy;

class VacancyController extends \App\Http\Controllers\Controller
{
    public function index()
    {
        return response()->json(Vacancy::with('plantillaItem')->paginate(25));
    }

    public function show(Vacancy $vacancy)
    {
        return response()->json($vacancy->load('plantillaItem'));
    }

    public function store(Request $request)
    {
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
        return response()->json($vacancy, 201);
    }

    public function update(Request $request, Vacancy $vacancy)
    {
        $validated = $request->validate([
            'status' => 'nullable|string|in:Draft,Published,Closed',
            'posting_date' => 'nullable|date',
            'closing_date' => 'nullable|date',
            'education' => 'nullable|string',
            'experience' => 'nullable|string',
            'training' => 'nullable|string',
            'eligibility' => 'nullable|string',
        ]);

        $vacancy->update($validated);
        return response()->json($vacancy);
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
            ->get();
        return response()->json($vacancies);
    }
}
