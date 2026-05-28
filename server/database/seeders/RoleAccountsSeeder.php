<?php

namespace Database\Seeders;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'name'  => 'HR Officer',
                'email' => 'hrmo@hris.test',
                'role'  => 'hrmo',
            ],
            [
                'name'  => 'HR Clerk',
                'email' => 'clerk@hris.test',
                'role'  => 'Clerk',
            ],
            [
                'name'  => 'Records Officer',
                'email' => 'records@hris.test',
                'role'  => 'records',
            ],
            [
                'name'  => 'Superintendent',
                'email' => 'superintendent@hris.test',
                'role'  => 'Superintendent',
            ],
            [
                'name'  => 'Supervisor',
                'email' => 'supervisor@hris.test',
                'role'  => 'Supervisor',
            ],
            [
                'name'  => 'Principal',
                'email' => 'principal@hris.test',
                'role'  => 'Principal',
            ],
            [
                'name'  => 'Employee',
                'email' => 'employee@hris.test',
                'role'  => 'Employee',
            ],
            [
                'name'  => 'CSC Officer',
                'email' => 'csc@hris.test',
                'role'  => 'csc',
            ],
            // New Workflow Roles
            [
                'name'  => 'HRMO Staff',
                'email' => 'hrmostaff@hris.test',
                'role'  => 'HRMO Staff',
            ],
            [
                'name'  => 'Records Staff (Workflow)',
                'email' => 'recordsstaff@hris.test',
                'role'  => 'Records Staff',
            ],
            [
                'name'  => 'ADAS Role',
                'email' => 'adasrole@hris.test',
                'role'  => 'ADAS',
            ],
            [
                'name'  => 'HRMO Role',
                'email' => 'hrmorole@hris.test',
                'role'  => 'HRMO',
            ],
            [
                'name'  => 'HRMPSB Sub-Committee',
                'email' => 'hrmpsbsub@hris.test',
                'role'  => 'HRMPSB Sub-Committee',
            ],
            [
                'name'  => 'HRMPSB Role',
                'email' => 'hrmpsbrole@hris.test',
                'role'  => 'HRMPSB',
            ],
            [
                'name'  => 'ADAS III',
                'email' => 'adas3@hris.test',
                'role'  => 'ADAS III',
            ],
            [
                'name'  => 'HRMO Staff/ HRMPSB Secretariat',
                'email' => 'secretariat@hris.test',
                'role'  => 'HRMO Staff/ HRMPSB Secretariat',
            ],
            [
                'name'  => 'HRMO / Appointing Authority',
                'email' => 'appointingauthority@hris.test',
                'role'  => 'HRMO / Appointing Authority',
            ],
            [
                'name'  => 'CSC Field Office',
                'email' => 'cscfield@hris.test',
                'role'  => 'CSC Field Office',
            ],
            [
                'name'  => 'DepEd Records Staff',
                'email' => 'depedrecords@hris.test',
                'role'  => 'DepEd Records Staff',
            ],
        ];

        foreach ($accounts as $account) {
            $user = User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'name'     => $account['name'],
                    'password' => Hash::make('Rolan123'),
                ]
            );

            $user->syncRoles([$account['role']]);
        }
    }
}
