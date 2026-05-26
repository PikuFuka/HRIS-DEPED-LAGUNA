<?php

namespace App\Modules\Recruitment\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends \App\Http\Controllers\Controller
{
    private function getMockApplications(): array
    {
        return [
            1 => [
                'id' => 1,
                'applicantId' => 99,
                'applicantName' => 'Juan Dela Cruz',
                'vacancyId' => 1,
                'position' => 'Administrative Assistant III',
                'status' => 'Screening',
                'step' => 4, // Screening Applicants
                'submittedAt' => '2026-05-20',
                'education' => "Completion of two years studies in college",
                'experience' => '1 year relevant experience',
                'eligibility' => 'Career Service Subprofessional / First Level Eligibility',
                'training' => '4 hours relevant training',
                'vacancy' => [
                    'id' => 1,
                    'itemNo' => 'OSEC-DECSB-ADAS3-001-2015',
                    'title' => 'Administrative Assistant III',
                    'salaryGrade' => 9,
                    'jobDescription' => 'Responsible for general administrative support, database maintenance, and division office record filing.',
                    'type' => 'plantilla',
                    'employmentStatus' => 'Permanent',
                    'contractDuration' => 'N/A'
                ]
            ],
            2 => [
                'id' => 2,
                'applicantId' => 100,
                'applicantName' => 'Maria Reyes',
                'vacancyId' => 2,
                'position' => 'Administrative Officer II',
                'status' => 'Preparing Deliberation',
                'step' => 8, // Prepare Deliberation Report
                'submittedAt' => '2026-05-15',
                'education' => "Bachelor's degree relevant to the job",
                'experience' => '1 year relevant experience',
                'eligibility' => 'Career Service Professional / Second Level Eligibility',
                'training' => '4 hours relevant training',
                'vacancy' => [
                    'id' => 2,
                    'itemNo' => 'OSEC-DECSB-ADOF2-002-2015',
                    'title' => 'Administrative Officer II',
                    'salaryGrade' => 11,
                    'jobDescription' => 'Responsible for division-level budget monitoring, personnel coordination, and procurement reporting.',
                    'type' => 'plantilla',
                    'employmentStatus' => 'Permanent',
                    'contractDuration' => 'N/A'
                ]
            ],
            3 => [
                'id' => 3,
                'applicantId' => 101,
                'applicantName' => 'Pedro Santos',
                'vacancyId' => 3,
                'position' => 'Teacher I',
                'status' => 'Reviewing Completeness',
                'step' => 12, // Review Appointment Completeness
                'submittedAt' => '2026-05-10',
                'education' => "Bachelor's degree in Elementary Education (BEEd) or equivalent",
                'experience' => 'None required',
                'eligibility' => 'RA 1080 (Teacher)',
                'training' => 'None required',
                'vacancy' => [
                    'id' => 3,
                    'itemNo' => 'OSEC-DECSB-T1-004-2018',
                    'title' => 'Teacher I',
                    'salaryGrade' => 11,
                    'jobDescription' => 'Responsible for facilitating learning, classroom instruction, and student assessment/grading.',
                    'type' => 'plantilla',
                    'employmentStatus' => 'Permanent',
                    'contractDuration' => 'N/A'
                ]
            ],
            4 => [
                'id' => 4,
                'applicantId' => 102,
                'applicantName' => 'Ana Lim',
                'vacancyId' => 4,
                'position' => 'Accountant I',
                'status' => 'Receipt of Applications',
                'step' => 3, // Receipt of Applications
                'submittedAt' => '2026-05-22',
                'education' => "Bachelor's degree in Commerce/Business Administration major in Accounting",
                'experience' => 'None required',
                'eligibility' => 'RA 1080 (CPA)',
                'training' => 'None required',
                'vacancy' => [
                    'id' => 4,
                    'itemNo' => 'OSEC-DECSB-ACNT1-003-2015',
                    'title' => 'Accountant I',
                    'salaryGrade' => 12,
                    'jobDescription' => 'Responsible for preparing monthly financial statements, bookkeeping, and disbursement audits.',
                    'type' => 'plantilla',
                    'employmentStatus' => 'Permanent',
                    'contractDuration' => 'N/A'
                ]
            ]
        ];
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
