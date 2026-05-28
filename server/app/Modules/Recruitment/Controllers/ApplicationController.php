<?php

namespace App\Modules\Recruitment\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Modules\Recruitment\Models\Application;

class ApplicationController extends \App\Http\Controllers\Controller
{
    public function index(): JsonResponse
    {
        // Load applicant and vacancy relationships
        $applications = Application::with(['applicant', 'vacancy.plantillaItem'])->get();
        return response()->json($applications);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vacancy_id' => 'required|exists:vacancies,id',
            'application_type' => 'nullable|string',
            'remarks' => 'nullable|string',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $user = $request->user();
        
        // Find or create applicant based on the logged-in user
        // Ensure robust parsing of first and last names
        $nameParts = explode(' ', trim($user->name));
        $lastName = count($nameParts) > 1 ? array_pop($nameParts) : 'Doe';
        $firstName = implode(' ', $nameParts);

        $applicant = \App\Modules\Recruitment\Models\Applicant::firstOrCreate(
            ['email' => $user->email],
            [
                'first_name' => $firstName,
                'last_name' => $lastName,
                'type' => 'Internal'
            ]
        );

        $application = Application::create([
            'applicant_id' => $applicant->id,
            'vacancy_id' => $validated['vacancy_id'],
            'date_applied' => now(),
            'application_type' => $validated['application_type'] ?? null,
            'status' => 'Submitted',
            'remarks' => $validated['remarks'] ?? null,
        ]);

        if ($request->hasFile('document')) {
            $filePath = $request->file('document')->store('applications', 'public');
            \App\Modules\Recruitment\Models\ApplicationDocument::create([
                'application_id' => $application->id,
                'document_name' => 'Resume/PDS',
                'file_path' => '/storage/' . $filePath,
                'date_uploaded' => now(),
                'is_complete' => true,
            ]);
        }

        return response()->json($application->load(['applicant', 'documents']), 201);
    }

    public function show($id): JsonResponse
    {
        $application = Application::with([
            'applicant', 
            'vacancy.plantillaItem', 
            'documents', 
            'evaluations.scores', 
            'evaluations.evaluator', 
            'finalDecision'
        ])->find($id);

        if (!$application) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        return response()->json($application);
    }

    public function advance(Request $request, $id): JsonResponse
    {
        $application = Application::find($id);

        if (!$application) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        $toStep = (int)$request->input('toStep');
        
        // Custom statuses mapping based on UI logic
        $statuses = [
            1 => 'Harvesting Vacancies',
            2 => 'Publishing Vacancies',
            3 => 'Receipt of Applications',
            4 => 'Screening',
            5 => 'Initial Evaluation',
            6 => 'Selection Process',
            7 => 'Consolidating Scores',
            8 => 'Preparing Deliberation',
            9 => 'Reviewing Reports',
            10 => 'Final Evaluation',
            11 => 'Preparing Appointments',
            12 => 'Reviewing Completeness',
            13 => 'Fully Hired'
        ];

        if (isset($statuses[$toStep])) {
            $application->status = $statuses[$toStep];
            $application->save();

            // Notify Applicant
            $application->load('applicant');
            if ($application->applicant) {
                $application->applicant->notify(new \App\Notifications\ApplicationAdvancedNotification($application));
            }
        }

        return response()->json($application);
    }
}
