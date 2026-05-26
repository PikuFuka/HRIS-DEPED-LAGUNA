<?php

namespace App\Modules\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    protected $fillable = [
        'plantilla_item_id',
        'status',
        'posting_date',
        'closing_date',
        'education',
        'experience',
        'training',
        'eligibility',
    ];

    protected function casts(): array
    {
        return [
            'posting_date' => 'date',
            'closing_date' => 'date',
        ];
    }

    public function plantillaItem()
    {
        return $this->belongsTo(PlantillaItem::class);
    }
}
