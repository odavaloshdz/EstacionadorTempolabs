<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use Illuminate\Support\Str;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear compañías de ejemplo
        Company::create([
            'name' => 'Estacionamiento Central',
            'address' => 'Av. Principal 123, Ciudad de México',
            'phone' => '5555123456',
            'email' => 'contacto@estacionamientocentral.com',
            'website' => 'www.estacionamientocentral.com',
            'status' => 'active',
            'subscription_start' => now(),
            'subscription_end' => now()->addYear(),
            'subscription_type' => 'premium',
            'max_users' => 10,
            'max_parking_spaces' => 100,
        ]);

        Company::create([
            'name' => 'Parking Express',
            'address' => 'Calle Secundaria 456, Guadalajara',
            'phone' => '3331234567',
            'email' => 'info@parkingexpress.com',
            'website' => 'www.parkingexpress.com',
            'status' => 'active',
            'subscription_start' => now(),
            'subscription_end' => now()->addMonths(6),
            'subscription_type' => 'basic',
            'max_users' => 5,
            'max_parking_spaces' => 50,
        ]);

        $this->command->info('Compañías creadas correctamente.');
    }
}
