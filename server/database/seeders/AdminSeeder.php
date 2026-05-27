<?php

namespace Database\Seeders;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name'     => 'Super Administrator',
                'password' => Hash::make('Rolan123'),
            ]
        );

        $user->syncRoles(['Super Admin']);
    }
}
