<?php

namespace App\Modules\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User; // Assuming User is in App\Models or App\Modules\Auth\Models

class Evaluation extends Model
{
    protected $fillable = [
        'application_id',
        'evaluator_id',
        'evaluation_type',
        'score',
        'remarks',
        'date_evaluated',
    ];

    protected function casts(): array
    {
        return [
            'date_evaluated' => 'date',
            'score' => 'decimal:2',
        ];
    }

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function evaluator()
    {
        return $this->belongsTo(\App\Modules\Auth\Models\User::class, 'evaluator_id');
    }

    public function scores()
    {
        return $this->hasMany(EvaluationScore::class);
    }
}
