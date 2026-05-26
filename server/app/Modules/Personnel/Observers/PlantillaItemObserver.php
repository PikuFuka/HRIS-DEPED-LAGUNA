<?php

namespace App\Modules\Personnel\Observers;

use App\Modules\Personnel\Enums\PlantillaStatus;
use App\Modules\Personnel\Models\PlantillaItem;
use App\Modules\Recruitment\Models\Vacancy;

class PlantillaItemObserver
{
    /**
     * Handle the PlantillaItem "updated" event.
     *
     * When a PlantillaItem transitions to 'unfilled', automatically create a Draft vacancy.
     */
    public function updated(PlantillaItem $plantillaItem): void
    {
        if ($plantillaItem->wasChanged('status') && $plantillaItem->status === PlantillaStatus::Unfilled) {
            Vacancy::create([
                'plantilla_item_id' => $plantillaItem->id,
                'status'            => 'Draft',
            ]);
        }
    }
}
