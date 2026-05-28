<?php

namespace App\Modules\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentRequirement extends Model
{
    protected $fillable = [
        'appointment_id',
        'document_name',
        'file_path',
        'is_complete',
        'date_submitted',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'is_complete' => 'boolean',
            'date_submitted' => 'date',
        ];
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
