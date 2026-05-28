<?php

namespace App\Modules\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationCriterion extends Model
{
    protected $table = 'evaluation_criteria';

    protected $fillable = [
        'criteria_name',
        'description',
        'weight',
        'category',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'weight' => 'decimal:2',
        ];
    }

    public function scores()
    {
        return $this->hasMany(EvaluationScore::class, 'criteria_id');
    }
}
