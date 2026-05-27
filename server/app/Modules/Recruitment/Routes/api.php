<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Recruitment\Controllers\VacancyController;
use App\Modules\Recruitment\Controllers\ApplicationController;

Route::get('/public/vacancies', [VacancyController::class, 'publicList']);
Route::middleware(['auth:sanctum'])->group(function () {
    // Vacancy management — HRMO, Super Admin
    Route::middleware(['role:hrmo|Super Admin'])->group(function () {
        Route::apiResource('vacancies', VacancyController::class);
    });

    // Applications — all authenticated users can view
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/applications/{id}', [ApplicationController::class, 'show']);
    Route::middleware(['role:hrmo|records|hrmpsb|adas|Superintendent|csc|Super Admin'])->group(function () {
        Route::post('/applications/{id}/advance', [ApplicationController::class, 'advance']);
    });
});