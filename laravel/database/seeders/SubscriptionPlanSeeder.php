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
            'description' => 'Plan básico para pequeños estacionamientos',
            'price' => 29.99,
            'billing_cycle' => 'monthly',
            'max_parking_lots' => 1,
            'max_parking_spaces' => 20,
            'max_users' => 2,
            'features' => json_encode([
                'Gestión de espacios',
                'Emisión de tickets',
                'Reportes básicos',
            ]),
            'is_active' => true,
            'is_featured' => false,
        ]);

        // Plan Estándar
        SubscriptionPlan::create([
            'name' => 'Plan Estándar',
            'slug' => 'plan-estandar',
            'description' => 'Plan estándar para estacionamientos medianos',
            'price' => 59.99,
            'billing_cycle' => 'monthly',
            'max_parking_lots' => 2,
            'max_parking_spaces' => 50,
            'max_users' => 5,
            'features' => json_encode([
                'Gestión de espacios',
                'Emisión de tickets',
                'Reportes avanzados',
                'Gestión de usuarios',
                'Notificaciones por email',
            ]),
            'is_active' => true,
            'is_featured' => true,
        ]);

        // Plan Premium
        SubscriptionPlan::create([
            'name' => 'Plan Premium',
            'slug' => 'plan-premium',
            'description' => 'Plan premium para grandes estacionamientos',
            'price' => 99.99,
            'billing_cycle' => 'monthly',
            'max_parking_lots' => 5,
            'max_parking_spaces' => 200,
            'max_users' => 10,
            'features' => json_encode([
                'Gestión de espacios',
                'Emisión de tickets',
                'Reportes avanzados',
                'Gestión de usuarios',
                'Notificaciones por email',
                'API para integraciones',
                'Soporte prioritario',
                'Personalización de tickets',
            ]),
            'is_active' => true,
            'is_featured' => false,
        ]);
    }
}
