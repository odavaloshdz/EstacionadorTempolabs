<?php

// Cargar el autoloader de Composer
require __DIR__ . '/../vendor/autoload.php';

// Cargar el framework Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Obtener todas las rutas
$routes = \Illuminate\Support\Facades\Route::getRoutes();

echo "=== RUTAS API DEFINIDAS ===\n";
echo "Nota: Estas son las rutas definidas en el archivo api.php\n\n";

// Obtener el contenido del archivo api.php para verificar las rutas definidas
$apiRouteFile = file_get_contents(__DIR__ . '/../routes/api.php');
echo "Contenido del archivo api.php:\n";
echo "--------------------------------\n";
echo $apiRouteFile;
echo "\n--------------------------------\n\n";

echo "Rutas registradas en el sistema:\n";
foreach ($routes as $route) {
    $uri = $route->uri();
    $methods = implode('|', $route->methods());
    $action = $route->getActionName();
    
    // Mostrar solo las rutas que comienzan con api/
    if (strpos($uri, 'api/') === 0) {
        echo "{$methods} {$uri} => {$action}\n";
    }
}

echo "\nVerificación completada.\n"; 