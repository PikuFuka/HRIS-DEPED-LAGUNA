<?php

namespace App\Modules\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationDocument extends Model
{
    protected $fillable = [
        'application_id',
        'document_name',
        'file_path',
        'date_uploaded',
        'is_complete',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'date_uploaded' => 'datetime',
            'is_complete' => 'boolean',
        ];
    }

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
