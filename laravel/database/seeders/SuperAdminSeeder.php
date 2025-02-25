<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario superadmin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@estacionador.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
        ]);

        // Crear usuario con el email adicional
        User::create([
            'name' => 'Omar Davalos',
            'email' => 'odavaloshdz@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
        ]);

        $this->command->info('Usuarios superadmin creados correctamente.');
    }
} 