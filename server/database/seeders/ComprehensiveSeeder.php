<?php

namespace Database\Seeders;

use App\Modules\Auth\Models\User;
use App\Modules\Personnel\Enums\EmploymentType;
use App\Modules\Personnel\Enums\PlantillaStatus;
use App\Modules\Personnel\Enums\Sex;
use App\Modules\Personnel\Models\Employee;
use App\Modules\Personnel\Models\ItemHistory;
use App\Modules\Personnel\Models\PlantillaItem;
use App\Modules\Recruitment\Models\Vacancy;
use App\Modules\Workflow\Models\Workflow;
use App\Modules\Workflow\Models\WorkflowTask;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ComprehensiveSeeder extends Seeder
{
    /**
     * Filipino names pool for realistic data
     */
    private array $firstNamesMale = [
        'Juan', 'Jose', 'Pedro', 'Carlos', 'Ramon', 'Antonio', 'Miguel', 'Rafael',
        'Francisco', 'Roberto', 'Eduardo', 'Fernando', 'Alejandro', 'Enrique', 'Manuel',
        'Ricardo', 'Gabriel', 'Daniel', 'Andres', 'Lorenzo', 'Julio', 'Marco', 'Victor',
        'Luis', 'Alberto', 'Emilio', 'Sergio', 'Angelo', 'Paolo', 'Renz', 'Jericho',
        'Mark', 'Ryan', 'Kenneth', 'Bryan', 'John', 'James', 'Michael', 'Vincent',
        'Christian', 'Patrick', 'Nathaniel', 'Joshua', 'Benedict', 'Adrian', 'Jerome',
        'Dominic', 'Francis', 'Gerald', 'Harold',
    ];

    private array $firstNamesFemale = [
        'Maria', 'Ana', 'Rosa', 'Lourdes', 'Clara', 'Teresa', 'Elena', 'Sofia',
        'Isabella', 'Carmen', 'Patricia', 'Gloria', 'Beatriz', 'Corazon', 'Felicidad',
        'Rosario', 'Dolores', 'Guadalupe', 'Pilar', 'Milagros', 'Jasmine', 'Grace',
        'Faith', 'Joy', 'Hope', 'Mary', 'Christine', 'Jennifer', 'Michelle', 'Nicole',
        'Angelica', 'Bianca', 'Camille', 'Diana', 'Erica', 'Fiona', 'Hannah', 'Irene',
        'Katherine', 'Leslie', 'Marian', 'Nadia', 'Olivia', 'Pearl', 'Queenie', 'Rachel',
        'Sarah', 'Trisha', 'Veronica', 'Yvonne',
    ];

    private array $lastNames = [
        'Dela Cruz', 'Santos', 'Reyes', 'Garcia', 'Mendoza', 'Bautista', 'Villanueva',
        'Ramos', 'Torres', 'Aquino', 'Cruz', 'Lopez', 'Gonzales', 'Flores', 'Rivera',
        'Navarro', 'Diaz', 'Ortega', 'Morales', 'Castillo', 'Pascual', 'Fernandez',
        'Alvarez', 'Tan', 'Lim', 'Gomez', 'Perez', 'Molina', 'Soriano', 'Aguilar',
        'Mercado', 'Hernandez', 'Santiago', 'De Leon', 'Enriquez', 'Salvador', 'Concepcion',
        'De Guzman', 'Ignacio', 'Tolentino',
    ];

    private array $middleNames = [
        'Santos', 'Rizal', 'Antonio', 'Lourdes', 'Marie', 'Angelo', 'James', 'Grace',
        'Pilar', 'Elena', null, null, null, null,
    ];

    /**
     * Position definitions for plantilla items with realistic DepEd data
     */
    private function getPositions(): array
    {
        return [
            // Teaching positions (60 items)
            ['title' => 'Teacher I',                  'sg' => 11, 'category' => 'Elem',  'tag' => 'Regular', 'count' => 20],
            ['title' => 'Teacher II',                 'sg' => 12, 'category' => 'Elem',  'tag' => 'Regular', 'count' => 10],
            ['title' => 'Teacher III',                'sg' => 13, 'category' => 'JHS',   'tag' => 'Regular', 'count' => 10],
            ['title' => 'Teacher I',                  'sg' => 11, 'category' => 'SHS',   'tag' => 'Regular', 'count' => 8],
            ['title' => 'Teacher I',                  'sg' => 11, 'category' => 'Kinder','tag' => 'Regular', 'count' => 5],
            ['title' => 'Master Teacher I',           'sg' => 18, 'category' => 'Elem',  'tag' => 'Regular', 'count' => 4],
            ['title' => 'Master Teacher II',          'sg' => 19, 'category' => 'JHS',   'tag' => 'Regular', 'count' => 3],
            // Teaching-related (20 items)
            ['title' => 'Head Teacher I',             'sg' => 14, 'category' => 'Elem',  'tag' => 'Regular', 'count' => 5],
            ['title' => 'Head Teacher III',           'sg' => 18, 'category' => 'JHS',   'tag' => 'Regular', 'count' => 3],
            ['title' => 'School Principal I',         'sg' => 19, 'category' => 'Elem',  'tag' => 'Regular', 'count' => 4],
            ['title' => 'School Principal II',        'sg' => 21, 'category' => 'JHS',   'tag' => 'Regular', 'count' => 3],
            ['title' => 'School Principal III',       'sg' => 22, 'category' => 'SHS',   'tag' => 'Regular', 'count' => 2],
            ['title' => 'Education Program Supervisor','sg' => 22, 'category' => 'SGOD', 'tag' => 'Regular', 'count' => 3],
            // Non-teaching (40 items)
            ['title' => 'Administrative Assistant III','sg' => 9,  'category' => 'Non-Teaching', 'tag' => 'Regular', 'count' => 6],
            ['title' => 'Administrative Officer II',  'sg' => 11, 'category' => 'Non-Teaching', 'tag' => 'Regular', 'count' => 4],
            ['title' => 'Administrative Officer IV',  'sg' => 15, 'category' => 'Non-Teaching', 'tag' => 'Regular', 'count' => 3],
            ['title' => 'Accountant I',               'sg' => 12, 'category' => 'Non-Teaching', 'tag' => 'Regular', 'count' => 2],
            ['title' => 'Human Resource Management Officer II', 'sg' => 15, 'category' => 'Non-Teaching', 'tag' => 'Regular', 'count' => 2],
            ['title' => 'Records Officer I',          'sg' => 10, 'category' => 'Non-Teaching', 'tag' => 'Regular', 'count' => 2],
            ['title' => 'Information Technology Officer I', 'sg' => 19, 'category' => 'Non-Teaching', 'tag' => 'Regular', 'count' => 2],
            ['title' => 'Engineer II',                'sg' => 16, 'category' => 'Non-Teaching', 'tag' => 'Regular', 'count' => 1],
            ['title' => 'Project Development Officer I','sg' => 11, 'category' => 'Non-Teaching', 'tag' => 'Regular', 'count' => 2],
            ['title' => 'Supply Officer I',           'sg' => 10, 'category' => 'Non-Teaching', 'tag' => 'Regular', 'count' => 1],
            ['title' => 'Cashier II',                 'sg' => 11, 'category' => 'Non-Teaching', 'tag' => 'Regular', 'count' => 1],
            ['title' => 'Schools Division Superintendent','sg' => 27,'category' => 'Non-Teaching','tag' => 'Regular','count' => 1],
            ['title' => 'Administrative Aide IV',     'sg' => 4,  'category' => 'Non-Teaching', 'tag' => 'Coterminous', 'count' => 3],
            ['title' => 'Administrative Aide VI',     'sg' => 6,  'category' => 'Non-Teaching', 'tag' => 'Coterminous', 'count' => 2],
            ['title' => 'Senior Education Program Specialist','sg' => 24,'category' => 'Non-Teaching','tag' => 'CTI','count' => 3],
            ['title' => 'Public Schools District Supervisor','sg' => 22,'category' => 'Non-Teaching','tag' => 'Regular','count' => 3],
            ['title' => 'Nurse II',                   'sg' => 15, 'category' => 'Non-Teaching', 'tag' => 'Regular', 'count' => 2],
        ];
    }

    private array $schools = [
        ['id' => 'SCH-001', 'name' => 'Mabini Elementary School'],
        ['id' => 'SCH-002', 'name' => 'Rizal National High School'],
        ['id' => 'SCH-003', 'name' => 'Laguna Senior High School'],
        ['id' => 'SCH-004', 'name' => 'Sta. Rosa Integrated School'],
        ['id' => 'SCH-005', 'name' => 'Biñan Central School'],
        ['id' => 'SCH-006', 'name' => 'San Pablo National High School'],
        ['id' => 'SCH-007', 'name' => 'Los Baños Elementary School'],
        ['id' => 'SCH-008', 'name' => 'Calamba National High School'],
        ['id' => 'SCH-009', 'name' => 'Pagsanjan Elementary School'],
        ['id' => 'SCH-010', 'name' => 'Cabuyao Integrated National High School'],
    ];

    private array $offices = [
        'Administrative Division', 'Finance Division', 'HRMO Section',
        'Records Section', 'ICT Unit', 'Office of the SDS', 'SGOD',
        'CID', 'Legal Unit', 'Supply Section',
    ];

    private array $eligibilities = [
        'Career Service Professional',
        'Career Service Subprofessional',
        'RA 1080 (Teacher)',
        'RA 1080 (Engineer)',
        'PD 907 (CPA)',
    ];

    public function run(): void
    {
        $this->command->info('🚀 Creating comprehensive demo data...');

        // ─────────────────────────────────────────────────────────────────────
        // 1. Create 100 Plantilla Employees + 20 Non-Plantilla Employees
        // ─────────────────────────────────────────────────────────────────────
        $this->command->info('   → Creating 120 employees...');

        $plantillaEmployees = [];
        $usedNames = [];

        for ($i = 1; $i <= 100; $i++) {
            $isMale = $i % 2 === 0;
            $firstName = $isMale
                ? $this->firstNamesMale[array_rand($this->firstNamesMale)]
                : $this->firstNamesFemale[array_rand($this->firstNamesFemale)];
            $lastName = $this->lastNames[array_rand($this->lastNames)];
            $middleName = $this->middleNames[array_rand($this->middleNames)];

            // Ensure unique employee IDs
            $empId = sprintf('EMP-%04d-%03d', rand(2016, 2025), $i);

            $employee = Employee::create([
                'employee_id'               => $empId,
                'first_name'                => $firstName,
                'middle_name'               => $middleName,
                'last_name'                 => $lastName,
                'suffix'                    => ($i % 15 === 0) ? 'Jr.' : null,
                'sex'                       => $isMale ? Sex::Male : Sex::Female,
                'dob'                       => fake()->dateTimeBetween('-55 years', '-23 years')->format('Y-m-d'),
                'civil_service_eligibility' => $this->eligibilities[array_rand($this->eligibilities)],
                'employment_type'           => EmploymentType::Plantilla,
                'gsis'                      => sprintf('GSIS-%03d-%04d', $i, rand(2015, 2025)),
                'tin'                       => fake()->numerify('###-###-###-000'),
                'station_id'                => $this->schools[array_rand($this->schools)]['id'],
                'original_appointment_date' => fake()->dateTimeBetween('-15 years', '-1 year')->format('Y-m-d'),
                'last_promotion_date'       => ($i % 3 === 0) ? fake()->dateTimeBetween('-5 years', '-6 months')->format('Y-m-d') : null,
                'appointment_status'        => ($i % 5 === 0) ? 'Temporary' : 'Permanent',
                'first_day_of_service'      => fake()->dateTimeBetween('-15 years', '-1 year')->format('Y-m-d'),
            ]);

            $plantillaEmployees[] = $employee;

            // Create a User account for this employee
            User::create([
                'name'     => trim($firstName . ' ' . $lastName),
                'email'    => strtolower($firstName) . '.' . strtolower(str_replace(' ', '', $lastName)) . $i . '@hris.test',
                'password' => Hash::make('Password123!'),
            ]);
        }

        // Non-Plantilla Employees (20, without plantilla items)
        $nonPlantillaWorkTypes = [
            'IT Support', 'Administrative Aide', 'Utility Worker', 'Records Assistant',
            'Data Encoder', 'Security Guard', 'Janitorial Staff', 'Driver',
            'Liaison Officer', 'Clerk',
        ];

        for ($i = 1; $i <= 20; $i++) {
            $isMale = $i % 2 === 0;
            $firstName = $isMale
                ? $this->firstNamesMale[array_rand($this->firstNamesMale)]
                : $this->firstNamesFemale[array_rand($this->firstNamesFemale)];
            $lastName = $this->lastNames[array_rand($this->lastNames)];

            Employee::create([
                'employee_id'         => sprintf('NP-%04d-%03d', rand(2023, 2026), $i),
                'first_name'          => $firstName,
                'middle_name'         => $this->middleNames[array_rand($this->middleNames)],
                'last_name'           => $lastName,
                'suffix'              => null,
                'sex'                 => $isMale ? Sex::Male : Sex::Female,
                'dob'                 => fake()->dateTimeBetween('-40 years', '-20 years')->format('Y-m-d'),
                'employment_type'     => EmploymentType::NonPlantilla,
                'tin'                 => fake()->numerify('###-###-###-000'),
                'nature_of_work'      => $nonPlantillaWorkTypes[array_rand($nonPlantillaWorkTypes)],
                'monthly_salary'      => [12000, 14000, 15000, 16000, 18000, 20000][array_rand([12000, 14000, 15000, 16000, 18000, 20000])],
                'station_id'          => $this->schools[array_rand($this->schools)]['id'],
                'status_of_engagement'=> ['JO', 'COS', 'Contractual'][array_rand(['JO', 'COS', 'Contractual'])],
                'contract_duration'   => ['6 months', '1 year', '2 years'][array_rand(['6 months', '1 year', '2 years'])],
                'source_of_funds'     => ['MOOE', 'SEF', 'GAA', 'LGU'][array_rand(['MOOE', 'SEF', 'GAA', 'LGU'])],
                'first_day_of_service'=> fake()->dateTimeBetween('-3 years', '-1 month')->format('Y-m-d'),
            ]);

            // Create a user account
            User::create([
                'name'     => trim($firstName . ' ' . $lastName),
                'email'    => strtolower($firstName) . '.np.' . strtolower(str_replace(' ', '', $lastName)) . $i . '@hris.test',
                'password' => Hash::make('Password123!'),
            ]);
        }

        // ─────────────────────────────────────────────────────────────────────
        // 2. Create 120 Plantilla Items (100 filled, 20 unfilled)
        // ─────────────────────────────────────────────────────────────────────
        $this->command->info('   → Creating 120 plantilla items (100 filled, 20 unfilled)...');

        $positions = $this->getPositions();
        $itemIndex = 0;
        $allItems = [];

        foreach ($positions as $pos) {
            for ($j = 0; $j < $pos['count']; $j++) {
                $itemIndex++;
                $isFilled = $itemIndex <= 100;

                $school = $this->schools[array_rand($this->schools)];
                $isTeachingPosition = in_array($pos['category'], ['Elem', 'JHS', 'SHS', 'Kinder']);

                $item = PlantillaItem::create([
                    'item_number'            => sprintf('OSEC-DECSB-%s-%03d-%04d', strtoupper(substr(str_replace(' ', '', $pos['title']), 0, 5)), $itemIndex, rand(2015, 2024)),
                    'position_title'         => $pos['title'],
                    'salary_grade'           => $pos['sg'],
                    'status'                 => $isFilled ? PlantillaStatus::Filled : PlantillaStatus::Unfilled,
                    'position_parenthetical' => ($itemIndex % 10 === 0) ? 'Special Science Teacher' : null,
                    'is_reclassified'        => ($itemIndex % 20 === 0),
                    'previous_item_number'   => ($itemIndex % 20 === 0) ? sprintf('OSEC-OLD-%03d-2010', $itemIndex) : null,
                    'tagging_of_item'        => $pos['tag'],
                    'step'                   => rand(1, 8),
                    'authorized_salary'      => $this->getSalary($pos['sg'], 1),
                    'actual_salary'          => $this->getSalary($pos['sg'], rand(1, 5)),
                    'code'                   => sprintf('C%03d', $itemIndex),
                    'type'                   => $isTeachingPosition ? 'Teaching' : 'Non-Teaching',
                    'level'                  => $isTeachingPosition ? ['Elementary', 'Secondary', 'Senior High'][array_rand(['Elementary', 'Secondary', 'Senior High'])] : 'Division Office',
                    'attri'                  => ($itemIndex % 8 === 0) ? 'Elective' : null,
                    'category'               => $pos['category'],
                    'school_id'              => $isTeachingPosition ? $school['id'] : null,
                    'school_name'            => $isTeachingPosition ? $school['name'] : null,
                    'actual_deployment'      => $isTeachingPosition ? $school['name'] : $this->offices[array_rand($this->offices)],
                    'employee_id'            => $isFilled ? $plantillaEmployees[$itemIndex - 1]->id : null,
                    'office_assignment'       => $isTeachingPosition ? $school['name'] : $this->offices[array_rand($this->offices)],
                ]);

                $allItems[] = $item;

                // Create history for filled items
                if ($isFilled) {
                    ItemHistory::create([
                        'plantilla_item_id'  => $item->id,
                        'past_employee_name' => $plantillaEmployees[$itemIndex - 1]->full_name,
                        'start_date'         => fake()->dateTimeBetween('-10 years', '-1 year')->format('Y-m-d'),
                        'end_date'           => null,
                        'remarks'            => null,
                        'status'             => 'active_holder',
                    ]);

                    // Add a previous holder for some items
                    if ($itemIndex % 4 === 0) {
                        $prevFirstName = $this->firstNamesMale[array_rand($this->firstNamesMale)];
                        $prevLastName = $this->lastNames[array_rand($this->lastNames)];
                        ItemHistory::create([
                            'plantilla_item_id'  => $item->id,
                            'past_employee_name' => "$prevLastName, $prevFirstName",
                            'start_date'         => fake()->dateTimeBetween('-20 years', '-11 years')->format('Y-m-d'),
                            'end_date'           => fake()->dateTimeBetween('-11 years', '-10 years')->format('Y-m-d'),
                            'remarks'            => ['Resigned', 'Transferred', 'Promoted', 'Retired'][array_rand(['Resigned', 'Transferred', 'Promoted', 'Retired'])],
                            'status'             => 'newly_created',
                        ]);
                    }
                }

                // Create history for unfilled items (previous holders)
                if (!$isFilled) {
                    $prevFirstName = $this->firstNamesFemale[array_rand($this->firstNamesFemale)];
                    $prevLastName = $this->lastNames[array_rand($this->lastNames)];
                    ItemHistory::create([
                        'plantilla_item_id'  => $item->id,
                        'past_employee_name' => "$prevLastName, $prevFirstName",
                        'start_date'         => fake()->dateTimeBetween('-8 years', '-3 years')->format('Y-m-d'),
                        'end_date'           => fake()->dateTimeBetween('-2 years', '-1 month')->format('Y-m-d'),
                        'remarks'            => ['Resigned', 'Transferred', 'Retired'][array_rand(['Resigned', 'Transferred', 'Retired'])],
                        'status'             => 'newly_created',
                    ]);
                }
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // 3. Create 20 Vacancies (for the 20 unfilled items)
        // ─────────────────────────────────────────────────────────────────────
        $this->command->info('   → Creating 20 vacancies...');

        $unfilledItems = array_slice($allItems, 100); // Items 101-120 are unfilled
        $vacancyStatuses = ['Published', 'Published', 'Published', 'Draft']; // 75% published

        foreach ($unfilledItems as $idx => $item) {
            $status = $vacancyStatuses[array_rand($vacancyStatuses)];
            Vacancy::create([
                'plantilla_item_id' => $item->id,
                'status'            => $status,
                'posting_date'      => $status === 'Published' ? fake()->dateTimeBetween('-2 months', 'now')->format('Y-m-d') : null,
                'closing_date'      => $status === 'Published' ? fake()->dateTimeBetween('+1 month', '+3 months')->format('Y-m-d') : null,
                'education'         => "Bachelor's degree relevant to the position",
                'experience'        => ($item->salary_grade >= 15) ? '2 years relevant experience' : '1 year relevant experience',
                'training'          => ($item->salary_grade >= 15) ? '8 hours relevant training' : '4 hours relevant training',
                'eligibility'       => $this->eligibilities[array_rand($this->eligibilities)],
            ]);
        }

        // ─────────────────────────────────────────────────────────────────────
        // 4. Create Workflows with Tasks (sample 10 workflows)
        // ─────────────────────────────────────────────────────────────────────
        $this->command->info('   → Creating 10 sample workflows...');

        $workflowTypes = ['Onboarding', 'Promotion', 'Transfer'];
        $workflowStatuses = ['Draft', 'HR Verification', 'Final Approval', 'Completed', 'Rejected'];
        $adminUser = User::where('email', 'admin@admin.com')->first();

        for ($i = 1; $i <= 10; $i++) {
            $type = $workflowTypes[array_rand($workflowTypes)];
            $status = $workflowStatuses[array_rand($workflowStatuses)];

            $workflow = Workflow::create([
                'reference_no' => sprintf('WF-%04d-%04d', date('Y'), $i),
                'type'         => $type,
                'employee_id'  => $plantillaEmployees[array_rand(array_slice($plantillaEmployees, 0, 20))]->id,
                'status'       => $status,
            ]);

            // Create tasks based on status
            WorkflowTask::create([
                'workflow_id'   => $workflow->id,
                'task_name'     => 'Document Submission',
                'assigned_role' => 'hrmo',
                'status'        => in_array($status, ['HR Verification', 'Final Approval', 'Completed']) ? 'Approved' : 'Pending',
                'comments'      => 'Documents submitted and verified.',
                'completed_by'  => in_array($status, ['HR Verification', 'Final Approval', 'Completed']) ? $adminUser?->id : null,
            ]);

            if (in_array($status, ['HR Verification', 'Final Approval', 'Completed'])) {
                WorkflowTask::create([
                    'workflow_id'   => $workflow->id,
                    'task_name'     => 'HR Verification',
                    'assigned_role' => 'hrmo',
                    'status'        => in_array($status, ['Final Approval', 'Completed']) ? 'Approved' : 'Pending',
                    'comments'      => in_array($status, ['Final Approval', 'Completed']) ? 'HR verification complete.' : null,
                    'completed_by'  => in_array($status, ['Final Approval', 'Completed']) ? $adminUser?->id : null,
                ]);
            }

            if (in_array($status, ['Final Approval', 'Completed'])) {
                WorkflowTask::create([
                    'workflow_id'   => $workflow->id,
                    'task_name'     => 'Final Approval',
                    'assigned_role' => 'Super Admin',
                    'status'        => $status === 'Completed' ? 'Approved' : 'Pending',
                    'comments'      => $status === 'Completed' ? 'Approved by superintendent.' : null,
                    'completed_by'  => $status === 'Completed' ? $adminUser?->id : null,
                ]);
            }

            if ($status === 'Rejected') {
                WorkflowTask::create([
                    'workflow_id'   => $workflow->id,
                    'task_name'     => 'HR Verification',
                    'assigned_role' => 'hrmo',
                    'status'        => 'Rejected',
                    'comments'      => 'Missing required documents. Please resubmit.',
                    'completed_by'  => $adminUser?->id,
                ]);
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // 5. Set up supervisor hierarchy (sample)
        // ─────────────────────────────────────────────────────────────────────
        $this->command->info('   → Setting up supervisor hierarchy...');

        // The SDS (last non-teaching item filled) supervises some principals
        $sdsEmployee = $plantillaEmployees[0]; // First employee as top
        
        // Set up a chain: SDS -> Principals -> Teachers
        for ($i = 1; $i <= 5; $i++) {
            $plantillaEmployees[$i]->update(['supervisor_id' => $sdsEmployee->id]);
            // Each principal supervises 5 teachers
            for ($j = 0; $j < 5; $j++) {
                $teacherIdx = 5 + (($i - 1) * 5) + $j;
                if ($teacherIdx < 100) {
                    $plantillaEmployees[$teacherIdx]->update(['supervisor_id' => $plantillaEmployees[$i]->id]);
                }
            }
        }

        $this->command->info('✅ Comprehensive demo data created successfully!');
        $this->command->info("   📊 120 employees (100 plantilla + 20 non-plantilla)");
        $this->command->info("   📋 120 plantilla items (100 filled + 20 unfilled)");
        $this->command->info("   📢 20 vacancies");
        $this->command->info("   🔄 10 workflows");
        $this->command->info("   👥 120+ user accounts");
    }

    /**
     * Approximate SSL salary by grade and step
     */
    private function getSalary(int $grade, int $step): float
    {
        $baseSalaries = [
            1 => 11551, 2 => 12175, 3 => 12830, 4 => 13520, 5 => 14245,
            6 => 15008, 7 => 15818, 8 => 16670, 9 => 17568, 10 => 18516,
            11 => 27000, 12 => 29165, 13 => 31320, 14 => 33843, 15 => 36619,
            16 => 39672, 17 => 42927, 18 => 46468, 19 => 51357, 20 => 54882,
            21 => 60689, 22 => 67088, 23 => 75441, 24 => 83406, 25 => 92214,
            26 => 101978, 27 => 112778, 28 => 126390, 29 => 141893, 30 => 159286,
            31 => 302151, 32 => 331954, 33 => 411382,
        ];

        $base = $baseSalaries[$grade] ?? 20000;
        return round($base * (1 + ($step - 1) * 0.025), 2);
    }
}
