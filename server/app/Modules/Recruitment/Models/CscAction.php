<?php

namespace App\Modules\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;

class CscAction extends Model
{
    protected $fillable = [
        'csc_submission_id',
        'action_taken',
        'action_date',
        'remarks',
        'file_path',
    ];

    protected function casts(): array
    {
        return [
            'action_date' => 'date',
        ];
    }

    public function submission()
    {
        return $this->belongsTo(CscSubmission::class, 'csc_submission_id');
    }
}
