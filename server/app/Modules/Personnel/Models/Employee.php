<?php

namespace App\Modules\Personnel\Models;

use App\Modules\Personnel\Enums\EmploymentType;
use App\Modules\Personnel\Enums\Sex;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    protected $fillable = [
        'employee_id',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'sex',
        'dob',
        'civil_service_eligibility',
        'employment_type',
        'gsis',
        'tin',
        'station_id',
        'nature_of_work',
        'monthly_salary',
        'pds_file_path',
        'oath_of_office_file_path',
        'assumption_of_duty_file_path',
        'supervisor_id',
    ];

    protected function casts(): array
    {
        return [
            'dob'             => 'date',
            'sex'             => Sex::class,
            'employment_type' => EmploymentType::class,
            'monthly_salary'  => 'decimal:2',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    /**
     * Convenience accessor: returns "Last, First M. Suffix".
     */
    public function getFullNameAttribute(): string
    {
        $parts = [$this->last_name . ',', $this->first_name];

        if ($this->middle_name) {
            $parts[] = mb_substr($this->middle_name, 0, 1) . '.';
        }

        if ($this->suffix) {
            $parts[] = $this->suffix;
        }

        return implode(' ', $parts);
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function plantillaItem(): HasOne
    {
        return $this->hasOne(PlantillaItem::class);
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'supervisor_id');
    }

    public function subordinates(): HasMany
    {
        return $this->hasMany(Employee::class, 'supervisor_id')->with('subordinates');
    }
}
