<?php

namespace App\Modules\Recruitment\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Recruitment\Models\DeliberationReport;
use App\Modules\Recruitment\Models\ReportSignatory;

class DeliberationReportController extends Controller
{
    public function index($vacancy_id): JsonResponse
    {
        $reports = DeliberationReport::with(['preparer', 'signatories.user'])
            ->where('vacancy_id', $vacancy_id)
            ->get();
        return response()->json($reports);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vacancy_id' => 'required|exists:vacancies,id',
            'status' => 'nullable|string',
            'file_path' => 'nullable|string',
        ]);

        $report = DeliberationReport::create([
            'vacancy_id' => $validated['vacancy_id'],
            'report_date' => now(),
            'prepared_by' => $request->user()->id,
            'status' => $validated['status'] ?? 'Draft',
            'file_path' => $validated['file_path'] ?? null,
        ]);

        return response()->json($report->load('preparer'), 201);
    }

    public function sign(Request $request, $id): JsonResponse
    {
        $report = DeliberationReport::findOrFail($id);
        
        $validated = $request->validate([
            'designation' => 'required|string',
        ]);

        $signatory = ReportSignatory::create([
            'report_id' => $report->id,
            'user_id' => $request->user()->id,
            'designation' => $validated['designation'],
            'date_signed' => now(),
        ]);

        return response()->json($signatory->load('user'), 201);
    }
}
