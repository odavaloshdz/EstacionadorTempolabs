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
            'name' => 'Básico',
            'slug' => 'basico',
            'description' => 'Plan ideal para pequeños estacionamientos con capacidad limitada.',
            'price' => 29.99,
            'billing_cycle' => 'monthly',
            'max_parking_lots' => 1,
            'max_parking_spaces' => 20,
            'max_users' => 3,
            'features' => [
                'Gestión de espacios de estacionamiento',
                'Emisión de tickets',
                'Reportes básicos',
                'Soporte por email'
            ],
            'is_active' => true,
            'is_featured' => false,
        ]);

        // Plan Estándar
        SubscriptionPlan::create([
            'name' => 'Estándar',
            'slug' => 'estandar',
            'description' => 'Plan para estacionamientos medianos con necesidades de gestión más avanzadas.',
            'price' => 59.99,
            'billing_cycle' => 'monthly',
            'max_parking_lots' => 2,
            'max_parking_spaces' => 50,
            'max_users' => 5,
            'features' => [
                'Gestión de espacios de estacionamiento',
                'Emisión de tickets',
                'Reportes avanzados',
                'Gestión de usuarios',
                'Soporte prioritario',
                'Personalización básica'
            ],
            'is_active' => true,
            'is_featured' => true,
        ]);

        // Plan Premium
        SubscriptionPlan::create([
            'name' => 'Premium',
            'slug' => 'premium',
            'description' => 'Plan completo para grandes estacionamientos con múltiples ubicaciones.',
            'price' => 99.99,
            'billing_cycle' => 'monthly',
            'max_parking_lots' => 5,
            'max_parking_spaces' => 200,
            'max_users' => 10,
            'features' => [
                'Gestión de espacios de estacionamiento',
                'Emisión de tickets',
                'Reportes avanzados y personalizados',
                'Gestión de usuarios con roles avanzados',
                'Soporte 24/7',
                'Personalización completa',
                'API para integraciones',
                'Respaldo de datos diario'
            ],
            'is_active' => true,
            'is_featured' => false,
        ]);

        // Plan Anual
        SubscriptionPlan::create([
            'name' => 'Anual',
            'slug' => 'anual',
            'description' => 'Plan con facturación anual para ahorrar costos a largo plazo.',
            'price' => 599.99,
            'billing_cycle' => 'yearly',
            'max_parking_lots' => 3,
            'max_parking_spaces' => 100,
            'max_users' => 8,
            'features' => [
                'Gestión de espacios de estacionamiento',
                'Emisión de tickets',
                'Reportes avanzados',
                'Gestión de usuarios con roles',
                'Soporte prioritario',
                'Personalización avanzada',
                'Descuento por pago anual'
            ],
            'is_active' => true,
            'is_featured' => false,
        ]);

        $this->command->info('Planes de suscripción creados correctamente.');
    }
}
