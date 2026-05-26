<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Workflow\Controllers\WorkflowController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/workflows/pending', [WorkflowController::class, 'pending']);
    Route::post('/workflows/{workflow}/approve', [WorkflowController::class, 'approve']);
    Route::post('/workflows/{workflow}/reject', [WorkflowController::class, 'reject']);
});