<?php

namespace App\Modules\Reports\Controllers;

use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends \App\Http\Controllers\Controller
{
    public function index()
    {
        // Load the logs with the user who caused the activity and the model that was modified (subject)
        $logs = Activity::with(['causer', 'subject'])->latest()->paginate(1000);
        return response()->json($logs);
    }
}

