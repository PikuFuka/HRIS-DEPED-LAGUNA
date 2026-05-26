<?php

namespace App\Modules\Workflow\Models;

use Illuminate\Database\Eloquent\Model;

class WorkflowTask extends Model
{
    protected $fillable = [
        'workflow_id',
        'task_name',
        'assigned_role',
        'status',
        'comments',
        'completed_by',
    ];

    public function workflow()
    {
        return $this->belongsTo(Workflow::class);
    }

    public function completedBy()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }
}
