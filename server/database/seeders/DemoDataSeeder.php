<?php

namespace Database\Seeders;

use App\Modules\Personnel\Enums\EmploymentType;
use App\Modules\Personnel\Enums\PlantillaStatus;
use App\Modules\Personnel\Enums\Sex;
use App\Modules\Personnel\Models\Employee;
use App\Modules\Personnel\Models\ItemHistory;
use App\Modules\Personnel\Models\PlantillaItem;
use App\Modules\Recruitment\Models\Vacancy;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |----------------------------------------------------------------------
        | Plantilla Employees (8 staff)
        |----------------------------------------------------------------------
        */
        $plantillaStaff = [
            ['employee_id' => 'EMP-2020-001', 'first_name' => 'Juan',      'middle_name' => 'Santos',   'last_name' => 'Dela Cruz',   'suffix' => null,  'sex' => Sex::Male,   'dob' => '1985-03-15', 'civil_service_eligibility' => 'Career Service Professional', 'gsis' => 'GSIS-001-2020', 'tin' => '123-456-789-000'],
            ['employee_id' => 'EMP-2019-002', 'first_name' => 'Maria',     'middle_name' => 'Lourdes',  'last_name' => 'Reyes',       'suffix' => null,  'sex' => Sex::Female, 'dob' => '1990-07-22', 'civil_service_eligibility' => 'Career Service Professional', 'gsis' => 'GSIS-002-2019', 'tin' => '234-567-890-000'],
            ['employee_id' => 'EMP-2021-003', 'first_name' => 'Jose',      'middle_name' => 'Rizal',    'last_name' => 'Garcia',      'suffix' => 'Jr.', 'sex' => Sex::Male,   'dob' => '1988-11-30', 'civil_service_eligibility' => 'Career Service Subprofessional', 'gsis' => 'GSIS-003-2021', 'tin' => '345-678-901-000'],
            ['employee_id' => 'EMP-2018-004', 'first_name' => 'Ana',       'middle_name' => 'Marie',    'last_name' => 'Santos',      'suffix' => null,  'sex' => Sex::Female, 'dob' => '1992-01-10', 'civil_service_eligibility' => 'RA 1080 (Teacher)', 'gsis' => 'GSIS-004-2018', 'tin' => '456-789-012-000'],
            ['employee_id' => 'EMP-2022-005', 'first_name' => 'Pedro',     'middle_name' => null,       'last_name' => 'Mendoza',     'suffix' => null,  'sex' => Sex::Male,   'dob' => '1995-05-18', 'civil_service_eligibility' => 'Career Service Professional', 'gsis' => 'GSIS-005-2022', 'tin' => '567-890-123-000'],
            ['employee_id' => 'EMP-2017-006', 'first_name' => 'Rosa',      'middle_name' => 'Elena',    'last_name' => 'Bautista',    'suffix' => null,  'sex' => Sex::Female, 'dob' => '1980-09-03', 'civil_service_eligibility' => 'Career Service Professional', 'gsis' => 'GSIS-006-2017', 'tin' => '678-901-234-000'],
            ['employee_id' => 'EMP-2023-007', 'first_name' => 'Carlos',    'middle_name' => 'Antonio',  'last_name' => 'Villanueva',  'suffix' => null,  'sex' => Sex::Male,   'dob' => '1993-12-25', 'civil_service_eligibility' => 'Career Service Subprofessional', 'gsis' => 'GSIS-007-2023', 'tin' => '789-012-345-000'],
            ['employee_id' => 'EMP-2016-008', 'first_name' => 'Lourdes',   'middle_name' => 'Pilar',    'last_name' => 'Ramos',       'suffix' => null,  'sex' => Sex::Female, 'dob' => '1978-06-14', 'civil_service_eligibility' => 'Career Service Professional', 'gsis' => 'GSIS-008-2016', 'tin' => '890-123-456-000'],
        ];

        $employees = [];
        foreach ($plantillaStaff as $data) {
            $employees[] = Employee::create(array_merge($data, [
                'employment_type' => EmploymentType::Plantilla,
            ]));
        }

        /*
        |----------------------------------------------------------------------
        | Non-Plantilla Employees (4 staff: COS/JO)
        |----------------------------------------------------------------------
        */
        $nonPlantillaStaff = [
            ['employee_id' => 'NP-2024-001', 'first_name' => 'Mark',    'middle_name' => 'Angelo',  'last_name' => 'Torres',    'suffix' => null, 'sex' => Sex::Male,   'dob' => '1998-02-28', 'nature_of_work' => 'IT Support',           'monthly_salary' => 18000.00],
            ['employee_id' => 'NP-2024-002', 'first_name' => 'Jasmine', 'middle_name' => null,      'last_name' => 'Aquino',    'suffix' => null, 'sex' => Sex::Female, 'dob' => '1997-08-05', 'nature_of_work' => 'Administrative Aide',  'monthly_salary' => 15000.00],
            ['employee_id' => 'NP-2024-003', 'first_name' => 'Ryan',    'middle_name' => 'James',   'last_name' => 'Pascual',   'suffix' => null, 'sex' => Sex::Male,   'dob' => '2000-04-12', 'nature_of_work' => 'Utility Worker',       'monthly_salary' => 12000.00],
            ['employee_id' => 'NP-2023-004', 'first_name' => 'Grace',   'middle_name' => 'Marie',   'last_name' => 'Fernandez', 'suffix' => null, 'sex' => Sex::Female, 'dob' => '1996-10-20', 'nature_of_work' => 'Records Assistant',    'monthly_salary' => 16000.00],
        ];

        foreach ($nonPlantillaStaff as $data) {
            Employee::create(array_merge($data, [
                'employment_type' => EmploymentType::NonPlantilla,
                'tin' => fake()->numerify('###-###-###-000'),
            ]));
        }

        /*
        |----------------------------------------------------------------------
        | Plantilla Items (10 items — 8 filled, 2 unfilled)
        |----------------------------------------------------------------------
        */
        $items = [
            ['item_number' => 'OSEC-DECSB-ADAS3-001-2015', 'position_title' => 'Administrative Assistant III',             'salary_grade' => 9,  'office_assignment' => 'Administrative Division'],
            ['item_number' => 'OSEC-DECSB-ADOF2-002-2015', 'position_title' => 'Administrative Officer II',                'salary_grade' => 11, 'office_assignment' => 'Administrative Division'],
            ['item_number' => 'OSEC-DECSB-ACNT1-003-2015', 'position_title' => 'Accountant I',                             'salary_grade' => 12, 'office_assignment' => 'Finance Division'],
            ['item_number' => 'OSEC-DECSB-T1-004-2018',    'position_title' => 'Teacher I',                                'salary_grade' => 11, 'office_assignment' => 'Mabini Elementary School'],
            ['item_number' => 'OSEC-DECSB-HRMO2-005-2015', 'position_title' => 'Human Resource Management Officer II',     'salary_grade' => 15, 'office_assignment' => 'HRMO Section'],
            ['item_number' => 'OSEC-DECSB-RECO1-006-2015', 'position_title' => 'Records Officer I',                        'salary_grade' => 10, 'office_assignment' => 'Records Section'],
            ['item_number' => 'OSEC-DECSB-IT1-007-2020',   'position_title' => 'Information Technology Officer I',         'salary_grade' => 19, 'office_assignment' => 'ICT Unit'],
            ['item_number' => 'OSEC-DECSB-SDS-008-2015',   'position_title' => 'Schools Division Superintendent',          'salary_grade' => 27, 'office_assignment' => 'Office of the SDS'],
            // These 2 items are VACANT
            ['item_number' => 'OSEC-DECSB-ADOF4-009-2023', 'position_title' => 'Administrative Officer IV',                'salary_grade' => 15, 'office_assignment' => 'Administrative Division'],
            ['item_number' => 'OSEC-DECSB-ENGR2-010-2024', 'position_title' => 'Engineer II',                              'salary_grade' => 16, 'office_assignment' => 'School Facilities Division'],
        ];

        $plantillaItems = [];
        foreach ($items as $i => $data) {
            $isFilled = $i < 8; // First 8 are filled

            $plantillaItems[] = PlantillaItem::create(array_merge($data, [
                'status'      => $isFilled ? PlantillaStatus::Filled : PlantillaStatus::Unfilled,
                'employee_id' => $isFilled ? $employees[$i]->id : null,
            ]));
        }

        /*
        |----------------------------------------------------------------------
        | Item Histories — Tracks who held each position
        |----------------------------------------------------------------------
        */

        // Current holders (active)
        foreach (array_slice($plantillaItems, 0, 8) as $i => $item) {
            $emp = $employees[$i];
            ItemHistory::create([
                'plantilla_item_id'  => $item->id,
                'past_employee_name' => $emp->full_name,
                'start_date'         => fake()->dateTimeBetween('-5 years', '-1 year'),
                'end_date'           => null,
                'remarks'            => null,
                'status'             => 'active_holder',
            ]);
        }

        // Historical records — previous holders of some items
        $historicalRecords = [
            ['item_index' => 0, 'name' => 'Elena M. Soriano',    'start' => '2010-06-01', 'end' => '2019-03-15', 'remarks' => 'Resigned'],
            ['item_index' => 0, 'name' => 'Roberto A. Lim',      'start' => '2005-01-10', 'end' => '2010-05-31', 'remarks' => 'Transferred'],
            ['item_index' => 2, 'name' => 'Patricia S. Tan',     'start' => '2015-08-01', 'end' => '2021-12-30', 'remarks' => 'Promoted'],
            ['item_index' => 5, 'name' => 'Fernando R. Cruz',    'start' => '2012-03-01', 'end' => '2018-07-31', 'remarks' => 'Retired'],
            ['item_index' => 7, 'name' => 'Corazon A. Dimaculangan', 'start' => '2008-01-15', 'end' => '2016-06-30', 'remarks' => 'Retired'],
            // Histories for vacant items
            ['item_index' => 8, 'name' => 'Miguel J. Alvarez',   'start' => '2023-01-01', 'end' => '2025-11-30', 'remarks' => 'Transferred'],
            ['item_index' => 9, 'name' => 'Sophia L. Navarro',   'start' => '2024-03-15', 'end' => '2026-01-31', 'remarks' => 'Resigned'],
        ];

        foreach ($historicalRecords as $record) {
            ItemHistory::create([
                'plantilla_item_id'  => $plantillaItems[$record['item_index']]->id,
                'past_employee_name' => $record['name'],
                'start_date'         => $record['start'],
                'end_date'           => $record['end'],
                'remarks'            => $record['remarks'],
                'status'             => 'newly_created',
            ]);
        }

        /*
        |----------------------------------------------------------------------
        | Vacancies — For the 2 unfilled items
        |----------------------------------------------------------------------
        */
        Vacancy::create([
            'plantilla_item_id' => $plantillaItems[8]->id,
            'status'            => 'Published',
            'posting_date'      => '2026-01-15',
            'closing_date'      => '2026-06-30',
            'education'         => "Bachelor's degree relevant to the job",
            'experience'        => '2 years relevant experience',
            'training'          => '8 hours relevant training',
            'eligibility'       => 'Career Service Professional / Second Level Eligibility',
        ]);

        Vacancy::create([
            'plantilla_item_id' => $plantillaItems[9]->id,
            'status'            => 'Draft',
            'education'         => "Bachelor's degree in Engineering",
            'experience'        => '1 year relevant experience',
            'training'          => '4 hours relevant training',
            'eligibility'       => 'RA 1080 (Engineer)',
        ]);
    }
}
