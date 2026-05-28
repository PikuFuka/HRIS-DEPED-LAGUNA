<?php

namespace App\Modules\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'decision_id',
        'appointment_number',
        'date_issued',
        'status',
        'file_path',
    ];

    protected function casts(): array
    {
        return [
            'date_issued' => 'date',
        ];
    }

    public function decision()
    {
        return $this->belongsTo(FinalDecision::class, 'decision_id');
    }

    public function requirements()
    {
        return $this->hasMany(AppointmentRequirement::class);
    }

    public function cscSubmissions()
    {
        return $this->hasMany(CscSubmission::class);
    }
}
