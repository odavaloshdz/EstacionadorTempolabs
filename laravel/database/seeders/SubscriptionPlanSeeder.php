<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;
use Illuminate\Support\Str;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Plan Básico
        SubscriptionPlan::create([
            'name' => 'Plan Básico',
            'slug' => 'plan-basico',
            'description' => 'Ideal para estacionamientos pequeños con hasta 50 espacios.',
            'price' => 499.00,
            'billing_cycle' => 'monthly',
            'max_parking_lots' => 1,
            'max_parking_spaces' => 50,
            'max_users' => 3,
            'features' => json_encode([
                'Gestión de tickets',
                'Reportes básicos',
                'Soporte por email'
            ]),
            'is_active' => true,
            'is_featured' => false,
        ]);

        // Plan Premium
        SubscriptionPlan::create([
            'name' => 'Plan Premium',
            'slug' => 'plan-premium',
            'description' => 'Perfecto para estacionamientos medianos con hasta 100 espacios.',
            'price' => 999.00,
            'billing_cycle' => 'monthly',
            'max_parking_lots' => 2,
            'max_parking_spaces' => 100,
            'max_users' => 5,
            'features' => json_encode([
                'Gestión de tickets',
                'Reportes avanzados',
                'Soporte prioritario',
                'Personalización de tarifas',
                'Reservas online'
            ]),
            'is_active' => true,
            'is_featured' => true,
        ]);

        // Plan Empresarial
        SubscriptionPlan::create([
            'name' => 'Plan Empresarial',
            'slug' => 'plan-empresarial',
            'description' => 'Solución completa para grandes estacionamientos o cadenas.',
            'price' => 1999.00,
            'billing_cycle' => 'monthly',
            'max_parking_lots' => 5,
            'max_parking_spaces' => 500,
            'max_users' => 15,
            'features' => json_encode([
                'Gestión de tickets',
                'Reportes personalizados',
                'Soporte 24/7',
                'API completa',
                'Integración con sistemas de pago',
                'Múltiples ubicaciones',
                'Análisis avanzado de datos'
            ]),
            'is_active' => true,
            'is_featured' => false,
        ]);

        $this->command->info('Planes de suscripción creados correctamente.');
    }
}
