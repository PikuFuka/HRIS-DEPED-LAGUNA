<?php

namespace App\Modules\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;

class CscSubmission extends Model
{
    protected $fillable = [
        'appointment_id',
        'submission_date',
        'status',
        'reference_no',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'submission_date' => 'date',
        ];
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function actions()
    {
        return $this->hasMany(CscAction::class);
    }
}
