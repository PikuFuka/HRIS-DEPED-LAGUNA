<?php

namespace App\Modules\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;

class ReportSignatory extends Model
{
    protected $fillable = [
        'report_id',
        'user_id',
        'designation',
        'date_signed',
    ];

    protected function casts(): array
    {
        return [
            'date_signed' => 'date',
        ];
    }

    public function report()
    {
        return $this->belongsTo(DeliberationReport::class, 'report_id');
    }

    public function user()
    {
        return $this->belongsTo(\App\Modules\Auth\Models\User::class);
    }
}
