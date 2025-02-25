<?php

// Cargar el autoloader de Composer
require __DIR__ . '/../vendor/autoload.php';

// Cargar el framework Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

// Credenciales del usuario administrador
$adminEmail = 'admin@estacionador.com';
$adminPassword = 'password123';

echo "Creando usuario administrador...\n";

// Verificar si el usuario ya existe
$existingUser = User::where('email', $adminEmail)->first();

if ($existingUser) {
    echo "El usuario administrador ya existe. Actualizando contraseña...\n";
    
    $existingUser->update([
        'password' => Hash::make($adminPassword),
        'is_super_admin' => true,
        'role' => 'admin',
        'is_active' => true
    ]);
    
    echo "Contraseña actualizada para el usuario: {$adminEmail}\n";
} else {
    // Crear un nuevo usuario administrador
    $user = User::create([
        'name' => 'Administrador',
        'email' => $adminEmail,
        'password' => Hash::make($adminPassword),
        'email_verified_at' => now(),
        'remember_token' => Str::random(10),
        'is_super_admin' => true,
        'role' => 'admin',
        'is_active' => true
    ]);
    
    echo "Usuario administrador creado con éxito.\n";
}

echo "\nCredenciales de acceso:\n";
echo "Email: {$adminEmail}\n";
echo "Contraseña: {$adminPassword}\n";
echo "\nUtiliza estas credenciales para iniciar sesión en la aplicación.\n"; 