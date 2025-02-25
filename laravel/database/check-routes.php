<?php

// Cargar el autoloader de Composer
require __DIR__ . '/../vendor/autoload.php';

// Cargar el framework Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Obtener todas las rutas
$routes = \Illuminate\Support\Facades\Route::getRoutes();

echo "=== RUTAS DEFINIDAS ===\n";
foreach ($routes as $route) {
    echo $route->methods()[0] . " " . $route->uri() . " => " . $route->getActionName() . "\n";
}

echo "\nVerificación completada.\n"; 