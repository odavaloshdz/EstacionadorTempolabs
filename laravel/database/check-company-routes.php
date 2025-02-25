<?php

// Cargar el autoloader de Composer
require __DIR__ . '/../vendor/autoload.php';

// Cargar el framework Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Obtener todas las rutas
$routes = \Illuminate\Support\Facades\Route::getRoutes();

echo "=== RUTAS RELACIONADAS CON EMPRESAS ===\n";
foreach ($routes as $route) {
    $uri = $route->uri();
    $action = $route->getActionName();
    if (strpos($uri, 'companies') !== false || strpos($action, 'CompanyController') !== false) {
        echo $route->methods()[0] . " " . $uri . " => " . $action . "\n";
    }
}

echo "\nVerificación completada.\n"; 