<?php

// Obtener las variables de entorno del archivo .env
$env = parse_ini_file(__DIR__ . '/../.env');

// Configuración de la base de datos
$host = $env['DB_HOST'] ?? '127.0.0.1';
$port = $env['DB_PORT'] ?? '3306';
$database = $env['DB_DATABASE'] ?? 'estacionador';
$username = $env['DB_USERNAME'] ?? 'root';
$password = $env['DB_PASSWORD'] ?? '';

try {
    // Conectar a MySQL sin especificar una base de datos
    $pdo = new PDO("mysql:host=$host;port=$port", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Crear la base de datos si no existe
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    echo "Base de datos '$database' creada o ya existente.\n";
} catch (PDOException $e) {
    die("Error al crear la base de datos: " . $e->getMessage() . "\n");
} 