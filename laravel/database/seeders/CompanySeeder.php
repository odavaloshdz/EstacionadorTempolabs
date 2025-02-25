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
        // Crear una empresa de ejemplo
        Company::create([
            'name' => 'Estacionador Demo',
            'slug' => 'estacionador-demo',
            'contact_email' => 'info@estacionador.com',
            'contact_phone' => '555-123-4567',
            'address' => 'Av. Principal 123',
            'city' => 'Ciudad de México',
            'state' => 'CDMX',
            'zip_code' => '01000',
            'country' => 'México',
            'description' => 'Empresa de demostración para el sistema de gestión de estacionamientos',
            'is_active' => true,
        ]);

        // Crear algunas empresas adicionales
        for ($i = 1; $i <= 3; $i++) {
            $name = "Estacionamiento $i";
            Company::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'contact_email' => "info$i@estacionamiento.com",
                'contact_phone' => "555-123-456$i",
                'address' => "Calle $i #123",
                'city' => 'Ciudad de México',
                'state' => 'CDMX',
                'zip_code' => "0100$i",
                'country' => 'México',
                'description' => "Empresa de estacionamiento número $i",
                'is_active' => true,
            ]);
        }
    }
}
