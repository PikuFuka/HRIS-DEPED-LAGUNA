<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Recruitment\Controllers\VacancyController;
use App\Modules\Recruitment\Controllers\ApplicationController;
use App\Modules\Recruitment\Controllers\EvaluationController;
use App\Modules\Recruitment\Controllers\DeliberationReportController;
use App\Modules\Recruitment\Controllers\AppointmentController;
use App\Modules\Recruitment\Controllers\CscActionController;

Route::get('/public/vacancies', [VacancyController::class, 'publicList']);
Route::middleware(['auth:sanctum'])->group(function () {
    // Vacancy management — HRMO, Super Admin
    Route::middleware(['role:hrmo|Super Admin'])->group(function () {
        Route::apiResource('vacancies', VacancyController::class);
    });

    // Applications — all authenticated users can view
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications/{id}', [ApplicationController::class, 'show']);
    Route::middleware(['role:hrmo|records|hrmpsb|adas|Superintendent|csc|Super Admin'])->group(function () {
        Route::post('/applications/{id}/advance', [ApplicationController::class, 'advance']);
        
        // Evaluations
        Route::get('/evaluations/{application_id}', [EvaluationController::class, 'index']);
        Route::post('/evaluations', [EvaluationController::class, 'store']);
        Route::put('/evaluations/{id}', [EvaluationController::class, 'update']);
        
        // Deliberation Reports
        Route::get('/deliberations/{vacancy_id}', [DeliberationReportController::class, 'index']);
        Route::post('/deliberations', [DeliberationReportController::class, 'store']);
        Route::post('/deliberations/{id}/sign', [DeliberationReportController::class, 'sign']);
        
        // Final Decisions and Appointments
        Route::post('/applications/{id}/decision', [AppointmentController::class, 'makeDecision']);
        Route::get('/appointments', [AppointmentController::class, 'index']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::post('/appointments/{id}/requirements', [AppointmentController::class, 'uploadRequirement']);
        
        // CSC Submissions and Actions
        Route::post('/appointments/{id}/csc-submissions', [CscActionController::class, 'submit']);
        Route::post('/csc-submissions/{id}/actions', [CscActionController::class, 'recordAction']);
    });
});