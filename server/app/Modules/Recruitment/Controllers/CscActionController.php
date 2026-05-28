<?php

namespace App\Modules\Recruitment\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Recruitment\Models\CscSubmission;
use App\Modules\Recruitment\Models\CscAction;

class CscActionController extends Controller
{
    public function submit(Request $request, $appointment_id): JsonResponse
    {
        $validated = $request->validate([
            'reference_no' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $submission = CscSubmission::create([
            'appointment_id' => $appointment_id,
            'submission_date' => now(),
            'status' => 'Submitted',
            'reference_no' => $validated['reference_no'] ?? null,
            'remarks' => $validated['remarks'] ?? null,
        ]);

        return response()->json($submission, 201);
    }

    public function recordAction(Request $request, $submission_id): JsonResponse
    {
        $submission = CscSubmission::findOrFail($submission_id);
        
        $validated = $request->validate([
            'action_taken' => 'required|string', // Received, Returned, Approved
            'remarks' => 'nullable|string',
            'file_path' => 'nullable|string',
        ]);

        $action = CscAction::create([
            'csc_submission_id' => $submission->id,
            'action_taken' => $validated['action_taken'],
            'action_date' => now(),
            'remarks' => $validated['remarks'] ?? null,
            'file_path' => $validated['file_path'] ?? null,
        ]);

        // Update submission status based on action
        $submission->update(['status' => $validated['action_taken']]);

        // Notify Applicant
        $submission->load('appointment.decision.application.applicant');
        $applicant = $submission->appointment->decision->application->applicant ?? null;
        if ($applicant) {
            $applicant->notify(new \App\Notifications\CscActionTakenNotification($action));
        }

        return response()->json($action, 201);
    }
}
