<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecutar los seeders personalizados
        $this->call([
            CompanySeeder::class,
            SubscriptionPlanSeeder::class,
        ]);
    }
}
