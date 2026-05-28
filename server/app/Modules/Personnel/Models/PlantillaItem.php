<?php

namespace App\Modules\Personnel\Models;

use App\Modules\Personnel\Enums\PlantillaStatus;
use App\Modules\Recruitment\Models\Vacancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlantillaItem extends Model
{
    protected $fillable = [
        'item_number',
        'position_title',
        'salary_grade',
        'status',
        'position_parenthetical',
        'is_reclassified',
        'previous_item_number',
        'tagging_of_item',
        'step',
        'authorized_salary',
        'actual_salary',
        'code',
        'type',
        'level',
        'attri',
        'category',
        'school_id',
        'school_name',
        'actual_deployment',
        'employee_id',
        'office_assignment',
    ];

    protected function casts(): array
    {
        return [
            'salary_grade'      => 'integer',
            'status'            => PlantillaStatus::class,
            'is_reclassified'   => 'boolean',
            'step'              => 'integer',
            'authorized_salary' => 'decimal:2',
            'actual_salary'     => 'decimal:2',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function itemHistories(): HasMany
    {
        return $this->hasMany(ItemHistory::class);
    }

    public function vacancies(): HasMany
    {
        return $this->hasMany(Vacancy::class);
    }
}
