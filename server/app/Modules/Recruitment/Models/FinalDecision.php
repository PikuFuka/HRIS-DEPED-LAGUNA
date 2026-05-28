<?php

namespace App\Modules\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;

class FinalDecision extends Model
{
    protected $fillable = [
        'application_id',
        'decided_by',
        'decision',
        'decision_date',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'decision_date' => 'date',
        ];
    }

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function decider()
    {
        return $this->belongsTo(\App\Modules\Auth\Models\User::class, 'decided_by');
    }

    public function appointment()
    {
        return $this->hasOne(Appointment::class, 'decision_id');
    }
}
