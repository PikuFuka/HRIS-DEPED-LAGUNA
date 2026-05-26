<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Recruitment\Controllers\VacancyController;
use App\Modules\Recruitment\Controllers\ApplicationController;

Route::get('/public/vacancies', [VacancyController::class, 'publicList']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('vacancies', VacancyController::class);
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/applications/{id}', [ApplicationController::class, 'show']);
    Route::post('/applications/{id}/advance', [ApplicationController::class, 'advance']);
});