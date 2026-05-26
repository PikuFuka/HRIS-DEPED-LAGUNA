<?php

namespace App\Modules\Workflow\Controllers;

use Illuminate\Http\Request;

use App\Modules\Workflow\Models\Workflow;
use App\Modules\Workflow\Models\WorkflowTask;
use Illuminate\Support\Facades\DB;

class WorkflowController extends \App\Http\Controllers\Controller
{
    public function pending(Request $request)
    {
        $user = $request->user();
        $roles = $user->roles->pluck('name')->toArray();

        $workflows = Workflow::whereHas('tasks', function ($query) use ($roles) {
            $query->whereIn('assigned_role', $roles)
                  ->where('status', 'Pending');
        })->with(['employee', 'tasks' => function ($query) use ($roles) {
            $query->whereIn('assigned_role', $roles)->where('status', 'Pending');
        }])->get();

        return response()->json($workflows);
    }

    public function approve(Request $request, Workflow $workflow)
    {
        $user = $request->user();
        $roles = $user->roles->pluck('name')->toArray();

        $task = $workflow->tasks()
            ->whereIn('assigned_role', $roles)
            ->where('status', 'Pending')
            ->firstOrFail();

        DB::transaction(function () use ($task, $workflow, $user) {
            // Approve the task
            $task->update([
                'status' => 'Approved',
                'completed_by' => $user->id,
            ]);

            // Engine logic to assign next step
            if ($task->task_name === 'HR Verification') {
                $workflow->update(['status' => 'Final Approval']);
                WorkflowTask::create([
                    'workflow_id' => $workflow->id,
                    'task_name' => 'Final Approval',
                    'assigned_role' => 'Super Admin', // Change to 'approver' if requested, but current DB uses 'Super Admin' or 'HR Admin'
                ]);
            } elseif ($task->task_name === 'Final Approval') {
                $workflow->update(['status' => 'Completed']);
            }
        });

        return response()->json(['message' => 'Task approved and workflow advanced.']);
    }

    public function reject(Request $request, Workflow $workflow)
    {
        $request->validate([
            'comments' => 'required|string',
        ]);

        $user = $request->user();
        $roles = $user->roles->pluck('name')->toArray();

        $task = $workflow->tasks()
            ->whereIn('assigned_role', $roles)
            ->where('status', 'Pending')
            ->firstOrFail();

        DB::transaction(function () use ($task, $workflow, $user, $request) {
            $task->update([
                'status' => 'Rejected',
                'comments' => $request->comments,
                'completed_by' => $user->id,
            ]);

            $workflow->update(['status' => 'Rejected']);
        });

        return response()->json(['message' => 'Workflow rejected.']);
    }

}
