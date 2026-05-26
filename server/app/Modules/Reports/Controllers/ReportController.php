<?php

namespace App\Modules\Reports\Controllers;

use Illuminate\Http\Request;

use App\Modules\Reports\Exports\POPExport;
use App\Modules\Reports\Exports\MonthlyReportExport;
use App\Modules\Personnel\Models\Employee;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends \App\Http\Controllers\Controller
{
    public function exportPOP()
    {
        return Excel::download(new POPExport, 'plantilla-of-personnel.xlsx');
    }

    public function exportMonthlyReport()
    {
        return Excel::download(new MonthlyReportExport, 'monthly-report.xlsx');
    }

    public function exportPDS($employee_id)
    {
        $employee = Employee::where('employee_id', $employee_id)->firstOrFail();
        
        $pdf = Pdf::loadView('reports.pds', ['employee' => $employee]);
        return $pdf->download("PDS-{$employee->employee_id}.pdf");
    }
}
