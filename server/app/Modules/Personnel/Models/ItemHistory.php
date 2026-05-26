<?php

namespace App\Modules\Personnel\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemHistory extends Model
{
    protected $fillable = [
        'plantilla_item_id',
        'past_employee_name',
        'start_date',
        'end_date',
        'remarks',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date'   => 'date',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function plantillaItem(): BelongsTo
    {
        return $this->belongsTo(PlantillaItem::class);
    }
}
