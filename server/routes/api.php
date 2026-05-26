<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| The main API routes are now loaded automatically from their respective 
| modules (Auth, Personnel, Recruitment, Workflow, Reports) via the
| ModuleServiceProvider.
|
*/

Route::get('/ping', function () {
    return response()->json(['message' => 'HRIS API is running']);
});
