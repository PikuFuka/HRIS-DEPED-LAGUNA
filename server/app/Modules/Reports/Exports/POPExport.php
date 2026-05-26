<?php

namespace App\Modules\Reports\Exports;

use App\Modules\Personnel\Models\PlantillaItem;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class POPExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return PlantillaItem::with('employee')->get();
    }

    public function headings(): array
    {
        return [
            'Item Number',
            'Position Title',
            'Salary Grade',
            'Status',
            'Occupant Name',
            'Employment Type',
        ];
    }

    public function map($item): array
    {
        return [
            $item->item_number,
            $item->position_title,
            $item->salary_grade,
            $item->status?->value ?? 'unfilled',
            $item->employee?->full_name ?? 'N/A',
            $item->employee?->employment_type?->value ?? 'N/A',
        ];
    }
}
