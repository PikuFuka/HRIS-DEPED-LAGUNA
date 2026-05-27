<?php

namespace App\Modules\Recruitment\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends \App\Http\Controllers\Controller
{
    private function getMockApplications(): array
    {
        return [];
    }

    public function index(): JsonResponse
    {
        return response()->json(array_values($this->getMockApplications()));
    }

    public function show($id): JsonResponse
    {
        $apps = $this->getMockApplications();
        $id = (int)$id;

        if (!isset($apps[$id])) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        return response()->json($apps[$id]);
    }

    public function advance(Request $request, $id): JsonResponse
    {
        $apps = $this->getMockApplications();
        $id = (int)$id;

        if (!isset($apps[$id])) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        $app = $apps[$id];
        $toStep = $request->input('toStep', $app['step'] + 1);
        $app['step'] = (int)$toStep;

        // Custom status tags to make the UI transition smoothly
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

        if (isset($statuses[$app['step']])) {
            $app['status'] = $statuses[$app['step']];
        }

        // Return updated application
        return response()->json($app);
    }
}
