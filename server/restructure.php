<?php

$base = __DIR__ . '/app';
$modulesDir = $base . '/Modules';

$modules = [
    'Auth' => [
        'Controllers' => ['AuthController.php', 'UserController.php'],
        'Models' => ['User.php'],
    ],
    'Personnel' => [
        'Controllers' => ['EmployeeController.php', 'PlantillaItemController.php', 'RecordsController.php', 'HierarchyController.php'],
        'Models' => ['Employee.php', 'PlantillaItem.php', 'ItemHistory.php'],
        'Enums' => ['EmploymentType.php', 'PlantillaStatus.php', 'Sex.php'],
        'Requests' => ['StorePlantillaRequest.php', 'StoreNonPlantillaRequest.php', 'StorePlantillaItemRequest.php', 'UpdatePlantillaItemRequest.php'],
        'Resources' => ['PlantillaItemResource.php', 'ItemHistoryResource.php'],
        'Observers' => ['PlantillaItemObserver.php'],
    ],
    'Recruitment' => [
        'Controllers' => ['VacancyController.php', 'ApplicationController.php'],
        'Models' => ['Vacancy.php'],
    ],
    'Workflow' => [
        'Controllers' => ['WorkflowController.php'],
        'Models' => ['Workflow.php', 'WorkflowTask.php'],
    ],
    'Reports' => [
        'Controllers' => ['ReportController.php', 'DashboardController.php', 'ActivityLogController.php'],
        'Exports' => ['POPExport.php', 'MonthlyReportExport.php'],
    ]
];

// Create directories and move files
foreach ($modules as $module => $structure) {
    foreach ($structure as $type => $files) {
        $targetDir = "$modulesDir/$module/$type";
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        foreach ($files as $file) {
            $sourceType = $type;
            if ($type === 'Controllers') $sourceType = 'Http/Controllers';
            if ($type === 'Requests') $sourceType = 'Http/Requests';
            if ($type === 'Resources') $sourceType = 'Http/Resources';
            
            $sourceFile = "$base/$sourceType/$file";
            $targetFile = "$targetDir/$file";
            
            if (file_exists($sourceFile)) {
                rename($sourceFile, $targetFile);
                echo "Moved $file to $module\n";
            }
        }
    }
}

// Function to update namespaces and use statements
function updateNamespaces($dir) {
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            $content = file_get_contents($file->getPathname());
            $originalContent = $content;

            // Replace Namespaces
            $content = preg_replace('/namespace App\\\\Http\\\\Controllers;/', 'namespace App\\Modules\\[MODULE]\\Controllers;', $content);
            $content = preg_replace('/namespace App\\\\Models;/', 'namespace App\\Modules\\[MODULE]\\Models;', $content);
            $content = preg_replace('/namespace App\\\\Enums;/', 'namespace App\\Modules\\[MODULE]\\Enums;', $content);
            $content = preg_replace('/namespace App\\\\Http\\\\Requests;/', 'namespace App\\Modules\\[MODULE]\\Requests;', $content);
            $content = preg_replace('/namespace App\\\\Http\\\\Resources;/', 'namespace App\\Modules\\[MODULE]\\Resources;', $content);
            $content = preg_replace('/namespace App\\\\Observers;/', 'namespace App\\Modules\\[MODULE]\\Observers;', $content);
            $content = preg_replace('/namespace App\\\\Exports;/', 'namespace App\\Modules\\[MODULE]\\Exports;', $content);

            // Fix the [MODULE] placeholder based on current file path
            $pathParts = explode(DIRECTORY_SEPARATOR, $file->getPathname());
            $moduleName = '';
            $modulesIndex = array_search('Modules', $pathParts);
            if ($modulesIndex !== false && isset($pathParts[$modulesIndex + 1])) {
                $moduleName = $pathParts[$modulesIndex + 1];
                $content = str_replace('[MODULE]', $moduleName, $content);
            }

            // Replace Use Statements
            $replacements = [
                // Models
                'App\Models\User' => 'App\Modules\Auth\Models\User',
                'App\Models\Employee' => 'App\Modules\Personnel\Models\Employee',
                'App\Models\PlantillaItem' => 'App\Modules\Personnel\Models\PlantillaItem',
                'App\Models\ItemHistory' => 'App\Modules\Personnel\Models\ItemHistory',
                'App\Models\Vacancy' => 'App\Modules\Recruitment\Models\Vacancy',
                'App\Models\Workflow' => 'App\Modules\Workflow\Models\Workflow',
                'App\Models\WorkflowTask' => 'App\Modules\Workflow\Models\WorkflowTask',
                // Enums
                'App\Enums\EmploymentType' => 'App\Modules\Personnel\Enums\EmploymentType',
                'App\Enums\PlantillaStatus' => 'App\Modules\Personnel\Enums\PlantillaStatus',
                'App\Enums\Sex' => 'App\Modules\Personnel\Enums\Sex',
                // Requests
                'App\Http\Requests\StorePlantillaRequest' => 'App\Modules\Personnel\Requests\StorePlantillaRequest',
                'App\Http\Requests\StoreNonPlantillaRequest' => 'App\Modules\Personnel\Requests\StoreNonPlantillaRequest',
                'App\Http\Requests\StorePlantillaItemRequest' => 'App\Modules\Personnel\Requests\StorePlantillaItemRequest',
                'App\Http\Requests\UpdatePlantillaItemRequest' => 'App\Modules\Personnel\Requests\UpdatePlantillaItemRequest',
                // Resources
                'App\Http\Resources\PlantillaItemResource' => 'App\Modules\Personnel\Resources\PlantillaItemResource',
                'App\Http\Resources\ItemHistoryResource' => 'App\Modules\Personnel\Resources\ItemHistoryResource',
                // Observers
                'App\Observers\PlantillaItemObserver' => 'App\Modules\Personnel\Observers\PlantillaItemObserver',
                // Exports
                'App\Exports\POPExport' => 'App\Modules\Reports\Exports\POPExport',
                'App\Exports\MonthlyReportExport' => 'App\Modules\Reports\Exports\MonthlyReportExport',
            ];

            foreach ($replacements as $old => $new) {
                // $content = str_replace($old, $new, $content);
                // Regex for exact match in use or type hints
                $content = preg_replace("/\\\\?" . preg_quote($old, '/') . "\\b/", $new, $content);
            }

            if ($content !== $originalContent) {
                file_put_contents($file->getPathname(), $content);
            }
        }
    }
}

updateNamespaces($modulesDir);
updateNamespaces(__DIR__ . '/database');
updateNamespaces(__DIR__ . '/config');
updateNamespaces(__DIR__ . '/routes');

// Write Route files for each module
$modulesRoutes = [
    'Auth' => <<<PHP
<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Auth\Controllers\AuthController;
use App\Modules\Auth\Controllers\UserController;

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::middleware(['role:Super Admin'])->prefix('admin')->group(function () {
        Route::get('/roles', fn () => \Spatie\Permission\Models\Role::all());
        Route::apiResource('users', UserController::class);
    });
});
PHP,

    'Personnel' => <<<PHP
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
PHP,

    'Recruitment' => <<<PHP
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
PHP,

    'Workflow' => <<<PHP
<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Workflow\Controllers\WorkflowController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/workflows/pending', [WorkflowController::class, 'pending']);
    Route::post('/workflows/{workflow}/approve', [WorkflowController::class, 'approve']);
    Route::post('/workflows/{workflow}/reject', [WorkflowController::class, 'reject']);
});
PHP,

    'Reports' => <<<PHP
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
PHP
];

foreach ($modulesRoutes as $module => $routeContent) {
    $routeDir = "$modulesDir/$module/Routes";
    if (!is_dir($routeDir)) {
        mkdir($routeDir, 0777, true);
    }
    file_put_contents("$routeDir/api.php", $routeContent);
}

// Create ModuleServiceProvider
$providerContent = <<<PHP
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class ModuleServiceProvider extends ServiceProvider
{
    public function boot()
    {
        \$modules = ['Auth', 'Personnel', 'Recruitment', 'Workflow', 'Reports'];

        foreach (\$modules as \$module) {
            \$routePath = app_path("Modules/{\$module}/Routes/api.php");
            if (file_exists(\$routePath)) {
                Route::prefix('api')->middleware('api')->group(\$routePath);
            }
        }
    }
}
PHP;
file_put_contents("$base/Providers/ModuleServiceProvider.php", $providerContent);

echo "Restructure script complete!\n";

