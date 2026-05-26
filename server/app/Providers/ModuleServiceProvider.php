<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class ModuleServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $modules = ['Auth', 'Personnel', 'Recruitment', 'Workflow', 'Reports'];

        foreach ($modules as $module) {
            $routePath = app_path("Modules/{$module}/Routes/api.php");
            if (file_exists($routePath)) {
                Route::prefix('api')->middleware('api')->group($routePath);
            }
        }
    }
}