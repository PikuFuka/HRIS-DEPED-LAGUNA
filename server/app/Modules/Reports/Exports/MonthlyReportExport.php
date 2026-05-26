<?php

namespace App\Modules\Reports\Exports;

use App\Modules\Personnel\Models\Employee;
use App\Modules\Personnel\Models\PlantillaItem;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class MonthlyReportExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        $totalEmployees = Employee::count();
        $plantillaCount = Employee::where('employment_type', 'Plantilla')->count();
        $nonPlantillaCount = Employee::whereIn('employment_type', ['COS', 'JO', 'Casual'])->count();
        $vacantItems = PlantillaItem::where('is_filled', false)->count();

        return collect([
            [
                'Total Active Employees' => $totalEmployees,
                'Plantilla Staff' => $plantillaCount,
                'Non-Plantilla Staff' => $nonPlantillaCount,
                'Vacant Plantilla Items' => $vacantItems,
            ]
        ]);
    }

    public function headings(): array
    {
        return [
            'Total Active Employees',
            'Plantilla Staff',
            'Non-Plantilla Staff',
            'Vacant Plantilla Items'
        ];
    }
}
