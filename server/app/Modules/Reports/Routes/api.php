<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Reports\Controllers\ReportController;
use App\Modules\Reports\Controllers\DashboardController;
use App\Modules\Reports\Controllers\ActivityLogController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/reports/pop', [ReportController::class, 'exportPOP']);
    Route::get('/reports/monthly', [ReportController::class, 'exportMonthlyReport']);
    Route::get('/reports/pds/{employee_id}', [ReportController::class, 'exportPDS']);
    
    Route::middleware(['role:Super Admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    });
});