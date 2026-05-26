<?php

namespace Database\Seeders;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoRoleAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'name'  => 'Super Administrator',
                'email' => 'admin@admin.com',
                'role'  => 'Super Admin',
            ],
            [
                'name'  => 'HR Officer',
                'email' => 'hr.officer@hris.test',
                'role'  => 'hrmo',
            ],
            [
                'name'  => 'Clerk',
                'email' => 'clerk@hris.test',
                'role'  => 'Clerk',
            ],
            [
                'name'  => 'Records Officer',
                'email' => 'records.officer@hris.test',
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
