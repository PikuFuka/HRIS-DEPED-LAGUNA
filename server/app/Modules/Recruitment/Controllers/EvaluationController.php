<?php

namespace App\Modules\Recruitment\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Recruitment\Models\Evaluation;
use App\Modules\Recruitment\Models\EvaluationScore;
use Illuminate\Support\Facades\DB;

class EvaluationController extends Controller
{
    public function index($application_id): JsonResponse
    {
        $evaluations = Evaluation::with(['scores.criterion', 'evaluator'])
            ->where('application_id', $application_id)
            ->get();
        return response()->json($evaluations);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'application_id' => 'required|exists:applications,id',
            'evaluation_type' => 'required|string',
            'remarks' => 'nullable|string',
            'scores' => 'required|array',
            'scores.*.criteria_id' => 'required|exists:evaluation_criteria,id',
            'scores.*.score' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $totalScore = array_sum(array_column($validated['scores'], 'score'));

            $evaluation = Evaluation::create([
                'application_id' => $validated['application_id'],
                'evaluator_id' => $request->user()->id,
                'evaluation_type' => $validated['evaluation_type'],
                'score' => $totalScore,
                'remarks' => $validated['remarks'] ?? null,
                'date_evaluated' => now(),
            ]);

            foreach ($validated['scores'] as $scoreData) {
                EvaluationScore::create([
                    'evaluation_id' => $evaluation->id,
                    'criteria_id' => $scoreData['criteria_id'],
                    'score' => $scoreData['score'],
                    // weighted_score logic could be added here
                ]);
            }

            return response()->json($evaluation->load('scores.criterion'), 201);
        });
    }

    public function update(Request $request, $id): JsonResponse
    {
        $evaluation = Evaluation::findOrFail($id);

        $validated = $request->validate([
            'remarks' => 'nullable|string',
            'score' => 'nullable|numeric',
        ]);

        $evaluation->update($validated);
        return response()->json($evaluation);
    }
}
