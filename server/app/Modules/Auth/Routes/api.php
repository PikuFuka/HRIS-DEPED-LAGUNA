<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Auth\Controllers\AuthController;
use App\Modules\Auth\Controllers\UserController;
use App\Modules\Auth\Controllers\EmployeeRegistrationController;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1')->name('login');
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/register-employee', [EmployeeRegistrationController::class, 'register']);
    Route::middleware(['role:Super Admin'])->prefix('admin')->group(function () {
        Route::get('/roles', fn () => \Spatie\Permission\Models\Role::all());
        Route::apiResource('users', UserController::class);
    });
});