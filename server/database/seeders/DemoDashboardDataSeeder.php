<?php

namespace Database\Seeders;

use App\Modules\Personnel\Models\PlantillaItem;
use App\Models\WorkflowApplication;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DemoDashboardDataSeeder extends Seeder
{
    public function run(): void
    {
        $plantillaItems = [
            ['item_no' => 'OSEC-DECSB-ADAS3-0001-2015', 'position_title' => 'Administrative Officer I', 'department' => 'OSDS', 'is_filled' => true],
            ['item_no' => 'OSEC-DECSB-ADAS3-0002-2015', 'position_title' => 'Administrative Aide VI', 'department' => 'OSDS', 'is_filled' => true],
            ['item_no' => 'OSEC-DECSB-ADAS3-0003-2015', 'position_title' => 'Teacher I', 'department' => 'CID', 'is_filled' => true],
            ['item_no' => 'OSEC-DECSB-ADAS3-0004-2015', 'position_title' => 'Teacher II', 'department' => 'CID', 'is_filled' => true],
            ['item_no' => 'OSEC-DECSB-ADAS3-0005-2015', 'position_title' => 'Teacher III', 'department' => 'CID', 'is_filled' => true],
            ['item_no' => 'OSEC-DECSB-ADAS3-0006-2015', 'position_title' => 'Master Teacher I', 'department' => 'CID', 'is_filled' => true],
            ['item_no' => 'OSEC-DECSB-ADAS3-0007-2015', 'position_title' => 'Master Teacher II', 'department' => 'CID', 'is_filled' => true],
            ['item_no' => 'OSEC-DECSB-ADAS3-0008-2015', 'position_title' => 'School Principal I', 'department' => 'CID', 'is_filled' => true],
            ['item_no' => 'OSEC-DECSB-ADAS3-0009-2015', 'position_title' => 'School Head I', 'department' => 'CID', 'is_filled' => true],
            ['item_no' => 'OSEC-DECSB-ADAS3-0010-2015', 'position_title' => 'Project Development Officer I', 'department' => 'SGOD', 'is_filled' => true],
            ['item_no' => 'OSEC-DECSB-ADAS3-0011-2015', 'position_title' => 'Education Program Supervisor', 'department' => 'SGOD', 'is_filled' => true],
            ['item_no' => 'OSEC-DECSB-ADAS3-0012-2015', 'position_title' => 'Administrative Officer II', 'department' => 'OSDS', 'is_filled' => false],
            ['item_no' => 'OSEC-DECSB-ADAS3-0013-2015', 'position_title' => 'Administrative Assistant I', 'department' => 'OSDS', 'is_filled' => false],
            ['item_no' => 'OSEC-DECSB-ADAS3-0014-2015', 'position_title' => 'Teacher I', 'department' => 'CID', 'is_filled' => false],
            ['item_no' => 'OSEC-DECSB-ADAS3-0015-2015', 'position_title' => 'Teacher II', 'department' => 'CID', 'is_filled' => false],
            ['item_no' => 'OSEC-DECSB-ADAS3-0016-2015', 'position_title' => 'Senior Education Program Specialist', 'department' => 'SGOD', 'is_filled' => false],
            ['item_no' => 'OSEC-DECSB-ADAS3-0017-2015', 'position_title' => 'Project Development Officer II', 'department' => 'SGOD', 'is_filled' => false],
            ['item_no' => 'OSEC-DECSB-ADAS3-0018-2015', 'position_title' => 'Records Officer I', 'department' => 'OSDS', 'is_filled' => false],
        ];

        foreach ($plantillaItems as $item) {
            PlantillaItem::updateOrCreate(
                ['item_no' => $item['item_no']],
                $item
            );
        }

        $workflowApplications = [
            ['workflow_no' => 'WF-2026-0001', 'applicant_name' => 'Maria Santos', 'position_title' => 'Teacher I', 'step' => 3, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-01')],
            ['workflow_no' => 'WF-2026-0002', 'applicant_name' => 'Jose Reyes', 'position_title' => 'Teacher II', 'step' => 4, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-02')],
            ['workflow_no' => 'WF-2026-0003', 'applicant_name' => 'Ana Cruz', 'position_title' => 'Teacher III', 'step' => 5, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-03')],
            ['workflow_no' => 'WF-2026-0004', 'applicant_name' => 'Ramon Garcia', 'position_title' => 'Master Teacher I', 'step' => 6, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-04')],
            ['workflow_no' => 'WF-2026-0005', 'applicant_name' => 'Clara Lopez', 'position_title' => 'Master Teacher II', 'step' => 7, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-05')],
            ['workflow_no' => 'WF-2026-0006', 'applicant_name' => 'Julio Navarro', 'position_title' => 'School Principal I', 'step' => 8, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-06')],
            ['workflow_no' => 'WF-2026-0007', 'applicant_name' => 'Theresa Aquino', 'position_title' => 'Project Development Officer I', 'step' => 9, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-07')],
            ['workflow_no' => 'WF-2026-0008', 'applicant_name' => 'Edgar Molina', 'position_title' => 'Education Program Supervisor', 'step' => 10, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-08')],
            ['workflow_no' => 'WF-2026-0009', 'applicant_name' => 'Nina Perez', 'position_title' => 'Administrative Officer II', 'step' => 11, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-09')],
            ['workflow_no' => 'WF-2026-0010', 'applicant_name' => 'Lorenzo Diaz', 'position_title' => 'Administrative Assistant I', 'step' => 12, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-10')],
            ['workflow_no' => 'WF-2026-0011', 'applicant_name' => 'Bea Flores', 'position_title' => 'Teacher I', 'step' => 13, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-11')],
            ['workflow_no' => 'WF-2026-0012', 'applicant_name' => 'Victor Lim', 'position_title' => 'Teacher II', 'step' => 14, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-12')],
            ['workflow_no' => 'WF-2026-0013', 'applicant_name' => 'Sofia Tan', 'position_title' => 'Records Officer I', 'step' => 15, 'status' => 'pending', 'submitted_at' => Carbon::parse('2026-05-13')],
            ['workflow_no' => 'WF-2026-0014', 'applicant_name' => 'Carlos Cruz', 'position_title' => 'Project Development Officer II', 'step' => 16, 'status' => 'completed', 'submitted_at' => Carbon::parse('2026-05-14')],
            ['workflow_no' => 'WF-2026-0015', 'applicant_name' => 'Yvonne Bautista', 'position_title' => 'Teacher III', 'step' => 16, 'status' => 'completed', 'submitted_at' => Carbon::parse('2026-05-15')],
            ['workflow_no' => 'WF-2026-0016', 'applicant_name' => 'Marco Villanueva', 'position_title' => 'School Head I', 'step' => 16, 'status' => 'completed', 'submitted_at' => Carbon::parse('2026-05-16')],
            ['workflow_no' => 'WF-2026-0017', 'applicant_name' => 'Ivy Gomez', 'position_title' => 'Administrative Officer I', 'step' => 2, 'status' => 'draft', 'submitted_at' => Carbon::parse('2026-05-17')],
            ['workflow_no' => 'WF-2026-0018', 'applicant_name' => 'Daniel Ortega', 'position_title' => 'Teacher I', 'step' => 1, 'status' => 'draft', 'submitted_at' => Carbon::parse('2026-05-18')],
        ];

        foreach ($workflowApplications as $application) {
            WorkflowApplication::updateOrCreate(
                ['workflow_no' => $application['workflow_no']],
                $application
            );
        }
    }
}
