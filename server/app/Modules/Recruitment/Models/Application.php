<?php

namespace App\Modules\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'applicant_id',
        'vacancy_id',
        'date_applied',
        'application_type',
        'status',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'date_applied' => 'date',
        ];
    }

    public function applicant()
    {
        return $this->belongsTo(Applicant::class);
    }

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function documents()
    {
        return $this->hasMany(ApplicationDocument::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function finalDecision()
    {
        return $this->hasOne(FinalDecision::class);
    }
}
