<?php

namespace App\Modules\Recruitment\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Recruitment\Models\FinalDecision;
use App\Modules\Recruitment\Models\Appointment;
use App\Modules\Recruitment\Models\AppointmentRequirement;
use App\Modules\Recruitment\Models\Application;

class AppointmentController extends Controller
{
    public function makeDecision(Request $request, $application_id): JsonResponse
    {
        $application = Application::findOrFail($application_id);
        
        $validated = $request->validate([
            'decision' => 'required|in:Approved,Disapproved',
            'remarks' => 'nullable|string',
        ]);

        $decision = FinalDecision::create([
            'application_id' => $application->id,
            'decided_by' => $request->user()->id,
            'decision' => $validated['decision'],
            'decision_date' => now(),
            'remarks' => $validated['remarks'] ?? null,
        ]);

        $application->applicant->notify(new \App\Notifications\FinalDecisionMadeNotification($decision));

        return response()->json($decision, 201);
    }

    public function index(): JsonResponse
    {
        $appointments = Appointment::with(['decision.application.applicant', 'requirements', 'cscSubmissions'])->get();
        return response()->json($appointments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'decision_id' => 'required|exists:final_decisions,id',
            'appointment_number' => 'required|string',
        ]);

        $appointment = Appointment::create([
            'decision_id' => $validated['decision_id'],
            'appointment_number' => $validated['appointment_number'],
            'date_issued' => now(),
            'status' => 'Draft',
        ]);

        return response()->json($appointment, 201);
    }

    public function uploadRequirement(Request $request, $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);

        $validated = $request->validate([
            'document_name' => 'required|string',
            'document' => 'required|file|mimes:pdf,doc,docx,jpg,png|max:5120',
        ]);

        $filePath = $request->file('document')->store('requirements', 'public');

        $requirement = AppointmentRequirement::create([
            'appointment_id' => $appointment->id,
            'document_name' => $validated['document_name'],
            'file_path' => '/storage/' . $filePath,
            'is_complete' => true,
            'date_submitted' => now(),
        ]);

        return response()->json($requirement, 201);
    }
}
