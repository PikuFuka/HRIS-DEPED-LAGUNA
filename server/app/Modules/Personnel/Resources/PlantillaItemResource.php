<?php

namespace App\Modules\Personnel\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlantillaItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'item_number'       => $this->item_number,
            'position_title'    => $this->position_title,
            'salary_grade'      => $this->salary_grade,
            'status'            => $this->status,
            'office_assignment' => $this->office_assignment,
            'employee'          => $this->whenLoaded('employee', fn () => [
                'id'              => $this->employee->id,
                'employee_id'     => $this->employee->employee_id,
                'first_name'      => $this->employee->first_name,
                'last_name'       => $this->employee->last_name,
                'full_name'       => $this->employee->full_name,
                'employment_type' => $this->employee->employment_type,
            ]),
            'item_histories'    => ItemHistoryResource::collection($this->whenLoaded('itemHistories')),
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
        ];
    }
}
