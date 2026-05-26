<?php

namespace App\Modules\Workflow\Models;

use Illuminate\Database\Eloquent\Model;

class Workflow extends Model
{
    protected $fillable = [
        'reference_no',
        'type',
        'employee_id',
        'status',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function tasks()
    {
        return $this->hasMany(WorkflowTask::class);
    }
}
