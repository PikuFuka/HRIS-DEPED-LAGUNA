<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Reports\Controllers\ReportController;
use App\Modules\Reports\Controllers\DashboardController;
use App\Modules\Reports\Controllers\ActivityLogController;

Route::middleware(['auth:sanctum'])->group(function () {
    // Reports & Analytics — HRMO, Records, Super Admin
    Route::middleware(['role:hrmo|records|Superintendent|Supervisor|Super Admin'])->group(function () {
        Route::get('/reports/pop', [ReportController::class, 'exportPOP']);
        Route::get('/reports/monthly', [ReportController::class, 'exportMonthlyReport']);
        Route::get('/reports/pds/{employee_id}', [ReportController::class, 'exportPDS']);
        Route::get('/analytics', [ReportController::class, 'getAnalytics']);
    });
    
    // Admin dashboard & logs — Super Admin only
    Route::middleware(['role:Super Admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    });
});