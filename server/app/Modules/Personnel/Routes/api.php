<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Personnel\Controllers\PlantillaItemController;
use App\Modules\Personnel\Controllers\RecordsController;
use App\Modules\Personnel\Controllers\EmployeeController;
use App\Modules\Personnel\Controllers\HierarchyController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('plantilla-items', PlantillaItemController::class)->only(['index', 'show', 'store', 'update']);
    Route::get('/records/plantilla', [RecordsController::class, 'plantilla']);
    Route::get('/records/non-plantilla', [RecordsController::class, 'nonPlantilla']);
    Route::post('/employees/plantilla', [EmployeeController::class, 'storePlantilla']);
    Route::post('/employees/non-plantilla', [EmployeeController::class, 'storeNonPlantilla']);
    Route::get('/hierarchy', [HierarchyController::class, 'index']);
});