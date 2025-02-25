<?php

// Cargar el autoloader de Composer
require __DIR__ . '/../vendor/autoload.php';

// Cargar el framework Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Verificar las empresas
echo "=== EMPRESAS ===\n";
$companies = \App\Models\Company::all();
foreach ($companies as $company) {
    echo "ID: {$company->id}, Nombre: {$company->name}, Email: {$company->contact_email}\n";
}

echo "\n=== PLANES DE SUSCRIPCIÓN ===\n";
$plans = \App\Models\SubscriptionPlan::all();
foreach ($plans as $plan) {
    echo "ID: {$plan->id}, Nombre: {$plan->name}, Precio: {$plan->price}\n";
}

echo "\nVerificación completada.\n"; 