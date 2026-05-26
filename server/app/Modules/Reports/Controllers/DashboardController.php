<?php

namespace App\Modules\Reports\Controllers;

use App\Modules\Personnel\Models\PlantillaItem;
use App\Models\WorkflowApplication;
use App\Modules\Auth\Models\User;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends \App\Http\Controllers\Controller
{
    public function index()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_plantilla_items' => PlantillaItem::count(),
            'filled_vacancies' => PlantillaItem::where('is_filled', true)->count(),
            'unfilled_vacancies' => PlantillaItem::where('is_filled', false)->count(),
            'pending_workflows' => WorkflowApplication::where('status', 'pending')->count(),
            'recent_logins' => Activity::where('description', 'User logged in')
                                ->latest()
                                ->take(5)
                                ->get()
                                ->load('causer'),
            'recent_activities' => Activity::where('description', '!=', 'User logged in')
                                ->latest()
                                ->take(5)
                                ->get()
                                ->load('causer'),
        ]);
    }
}

