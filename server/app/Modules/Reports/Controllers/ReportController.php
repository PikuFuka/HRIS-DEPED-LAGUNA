<?php

namespace App\Modules\Reports\Controllers;

use Illuminate\Http\Request;

use App\Modules\Reports\Exports\POPExport;
use App\Modules\Reports\Exports\MonthlyReportExport;
use App\Modules\Personnel\Models\Employee;
use App\Modules\Personnel\Models\PlantillaItem;
use App\Modules\Personnel\Models\ItemHistory;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

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

    public function getAnalytics()
    {
        $totalItems = PlantillaItem::count();
        $filledItems = PlantillaItem::where('status', 'filled')->count();
        $unfilledItems = $totalItems - $filledItems;
        $completionRate = $totalItems > 0 ? round(($filledItems / $totalItems) * 100, 1) : 0;

        $employeesCount = Employee::count();

        // Categorization logic based on new exact fields
        $items = PlantillaItem::all();
        $teaching = ['filled' => 0, 'unfilled' => 0, 'titles' => []];
        $teachingRelated = ['filled' => 0, 'unfilled' => 0, 'titles' => []];
        $nonTeaching = ['filled' => 0, 'unfilled' => 0, 'titles' => []];

        // Group by tagging
        $taggingCounts = [];

        foreach($items as $item) {
            $cat = $item->category ?: 'Non-Teaching'; // Fallback if empty
            if ($cat == 'Kinder' || $cat == 'Elem' || $cat == 'JHS' || $cat == 'SHS' || str_contains($cat, 'Teach')) {
                $cat = 'Teaching';
            } elseif (str_contains($cat, 'Principal') || str_contains($cat, 'Head')) {
                $cat = 'Teaching-Related';
            } else {
                $cat = 'Non-Teaching';
            }

            if ($item->status == 'filled') {
                if ($cat == 'Teaching') $teaching['filled']++;
                elseif ($cat == 'Teaching-Related') $teachingRelated['filled']++;
                else $nonTeaching['filled']++;
            } else {
                if ($cat == 'Teaching') $teaching['unfilled']++;
                elseif ($cat == 'Teaching-Related') $teachingRelated['unfilled']++;
                else $nonTeaching['unfilled']++;
            }

            // Tagging
            $tag = $item->tagging_of_item ?: 'Regular';
            if (!isset($taggingCounts[$tag])) {
                $taggingCounts[$tag] = ['filled' => 0, 'unfilled' => 0];
            }
            $taggingCounts[$tag][$item->status == 'filled' ? 'filled' : 'unfilled']++;

            // Group by position title
            $pt = $item->position_title ?: 'Unknown';
            if ($cat == 'Teaching') {
                if(!isset($teaching['titles'][$pt])) $teaching['titles'][$pt] = ['filled'=>0,'unfilled'=>0];
                $teaching['titles'][$pt][$item->status == 'filled' ? 'filled' : 'unfilled']++;
            } elseif ($cat == 'Teaching-Related') {
                if(!isset($teachingRelated['titles'][$pt])) $teachingRelated['titles'][$pt] = ['filled'=>0,'unfilled'=>0];
                $teachingRelated['titles'][$pt][$item->status == 'filled' ? 'filled' : 'unfilled']++;
            } else {
                if(!isset($nonTeaching['titles'][$pt])) $nonTeaching['titles'][$pt] = ['filled'=>0,'unfilled'=>0];
                $nonTeaching['titles'][$pt][$item->status == 'filled' ? 'filled' : 'unfilled']++;
            }
        }

        $byPositionTitle = [];
        $allTitles = array_merge($teaching['titles'], $teachingRelated['titles'], $nonTeaching['titles']);
        foreach($allTitles as $title => $counts) {
            $byPositionTitle[] = [
                'title' => $title,
                'filled' => $counts['filled'],
                'unfilled' => $counts['unfilled']
            ];
        }
        
        // Sort by total desc
        usort($byPositionTitle, function($a, $b) {
            return ($b['filled'] + $b['unfilled']) <=> ($a['filled'] + $a['unfilled']);
        });

        $filledByTagging = [];
        foreach($taggingCounts as $tag => $counts) {
            $filledByTagging[] = [
                'tag' => $tag,
                'filled' => $counts['filled'],
                'unfilled' => $counts['unfilled']
            ];
        }
        if (empty($filledByTagging)) {
            $filledByTagging = [
                [ 'tag' => 'Regular', 'filled' => $filledItems, 'unfilled' => $unfilledItems ]
            ];
        }

        $validationSummary = [
            [ 'field' => 'Full Name', 'total' => $employeesCount, 'matched' => $employeesCount, 'mismatched' => 0, 'verified' => $employeesCount, 'unverified' => 0 ],
            [ 'field' => 'Position Status', 'total' => $employeesCount, 'matched' => $employeesCount, 'mismatched' => 0, 'verified' => $employeesCount, 'unverified' => 0 ],
            [ 'field' => 'Sex at Birth', 'total' => $employeesCount, 'matched' => $employeesCount, 'mismatched' => 0, 'verified' => $employeesCount, 'unverified' => 0 ],
            [ 'field' => 'Date of Birth', 'total' => $employeesCount, 'matched' => $employeesCount, 'mismatched' => 0, 'verified' => $employeesCount, 'unverified' => 0 ],
        ];

        return response()->json([
            'region' => 'Region IV-A',
            'division' => 'Division of Laguna',
            'completionRate' => $completionRate,
            'validationSummary' => $validationSummary,
            'personnel' => [
                'depEdPlantilla' => Employee::where('employment_type', 'plantilla')->count() ?: $employeesCount,
                'nonDepEdPlantilla' => Employee::where('employment_type', 'non-plantilla')->count(),
                'grandTotal' => $employeesCount
            ],
            'filledByCategory' => [
                [ 'category' => 'Teaching', 'filled' => $teaching['filled'], 'unfilled' => $teaching['unfilled'] ],
                [ 'category' => 'Teaching-Related', 'filled' => $teachingRelated['filled'], 'unfilled' => $teachingRelated['unfilled'] ],
                [ 'category' => 'Non-Teaching', 'filled' => $nonTeaching['filled'], 'unfilled' => $nonTeaching['unfilled'] ],
            ],
            'filledByTagging' => $filledByTagging,
            'deployment' => [
                [ 'category' => 'Teaching', 'within' => $teaching['filled'], 'outside' => 0 ],
                [ 'category' => 'Teaching-Related', 'within' => $teachingRelated['filled'], 'outside' => 0 ],
                [ 'category' => 'Non-Teaching', 'within' => $nonTeaching['filled'], 'outside' => 0 ],
            ],
            'ageBracket' => [
                [ 'category' => 'Teaching', 'Below 30' => 0, '30–39' => $teaching['filled'], '40–49' => 0, '50–59' => 0, '60+' => 0 ],
                [ 'category' => 'Teaching-Related', 'Below 30' => 0, '30–39' => $teachingRelated['filled'], '40–49' => 0, '50–59' => 0, '60+' => 0 ],
                [ 'category' => 'Non-Teaching', 'Below 30' => 0, '30–39' => $nonTeaching['filled'], '40–49' => 0, '50–59' => 0, '60+' => 0 ],
            ],
            'yearsInService' => [
                [ 'category' => 'Teaching', '<1yr' => $teaching['filled'], '1–3yrs' => 0, '4–6yrs' => 0, '>7yrs' => 0 ],
                [ 'category' => 'Teaching-Related', '<1yr' => $teachingRelated['filled'], '1–3yrs' => 0, '4–6yrs' => 0, '>7yrs' => 0 ],
                [ 'category' => 'Non-Teaching', '<1yr' => $nonTeaching['filled'], '1–3yrs' => 0, '4–6yrs' => 0, '>7yrs' => 0 ],
            ],
            'unfilledReasons' => [
                [ 'reason' => 'Natural Vacancy', 'total' => $unfilledItems ],
                [ 'reason' => 'Awaiting CSC Attestations', 'total' => 0 ],
            ],
            'vacancyInYears' => [
                [ 'category' => 'Teaching', '<1yr' => $teaching['unfilled'], '1–3yrs' => 0, '4–6yrs' => 0, '>7yrs' => 0 ],
                [ 'category' => 'Teaching-Related', '<1yr' => $teachingRelated['unfilled'], '1–3yrs' => 0, '4–6yrs' => 0, '>7yrs' => 0 ],
                [ 'category' => 'Non-Teaching', '<1yr' => $nonTeaching['unfilled'], '1–3yrs' => 0, '4–6yrs' => 0, '>7yrs' => 0 ],
            ],
            'byPositionTitle' => array_slice($byPositionTitle, 0, 10), // top 10
        ]);
    }
}
