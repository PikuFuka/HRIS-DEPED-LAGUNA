<?php

namespace App\Modules\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;

class DeliberationReport extends Model
{
    protected $fillable = [
        'vacancy_id',
        'report_date',
        'prepared_by',
        'status',
        'file_path',
    ];

    protected function casts(): array
    {
        return [
            'report_date' => 'date',
        ];
    }

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function preparer()
    {
        return $this->belongsTo(\App\Modules\Auth\Models\User::class, 'prepared_by');
    }

    public function signatories()
    {
        return $this->hasMany(ReportSignatory::class, 'report_id');
    }
}
