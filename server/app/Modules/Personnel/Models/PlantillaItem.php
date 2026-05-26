<?php

namespace App\Modules\Personnel\Models;

use App\Modules\Personnel\Enums\PlantillaStatus;
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
        'employee_id',
        'office_assignment',
    ];

    protected function casts(): array
    {
        return [
            'salary_grade' => 'integer',
            'status'       => PlantillaStatus::class,
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
