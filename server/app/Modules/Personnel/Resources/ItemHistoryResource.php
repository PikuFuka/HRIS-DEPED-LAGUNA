<?php

namespace App\Modules\Personnel\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'past_employee_name' => $this->past_employee_name,
            'start_date'         => $this->start_date?->toDateString(),
            'end_date'           => $this->end_date?->toDateString(),
            'remarks'            => $this->remarks,
            'status'             => $this->status,
        ];
    }
}
