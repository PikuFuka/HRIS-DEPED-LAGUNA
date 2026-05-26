<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Roles
        $roles = [
            'Super Admin',
            'HR Officer',
            'Clerk',
            'Records Officer',
            'Superintendent',
            'Supervisor',
            'Principal',
            'Employee',
            'hrmo',
            'records',
            'hrmpsb',
            'approver',
            'csc',
            'applicant',
            'adas',
            'sds'
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }
    }
}
