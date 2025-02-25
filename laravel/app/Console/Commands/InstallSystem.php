<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class InstallSystem extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Instala y configura el sistema Estacionador';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando la instalación del sistema Estacionador...');

        // Paso 1: Migrar la base de datos
        $this->info('Paso 1: Migrando la base de datos...');
        $this->call('migrate:fresh');
        
        // Paso 2: Ejecutar los seeders
        $this->info('Paso 2: Ejecutando los seeders...');
        $this->call('db:seed');
        
        // Paso 3: Generar el enlace simbólico para el almacenamiento
        $this->info('Paso 3: Generando enlace simbólico para el almacenamiento...');
        $this->call('storage:link');
        
        // Paso 4: Limpiar caché
        $this->info('Paso 4: Limpiando caché...');
        $this->call('cache:clear');
        $this->call('config:clear');
        $this->call('route:clear');
        $this->call('view:clear');
        
        // Paso 5: Optimizar la aplicación
        $this->info('Paso 5: Optimizando la aplicación...');
        $this->call('optimize');
        
        // Finalizar
        $this->info('¡Instalación completada con éxito!');
        $this->info('Puedes acceder al sistema con las siguientes credenciales:');
        $this->info('Email: admin@estacionador.com');
        $this->info('Contraseña: password');
        
        return Command::SUCCESS;
    }
} 