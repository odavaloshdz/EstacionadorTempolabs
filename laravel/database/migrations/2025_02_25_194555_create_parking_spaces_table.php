<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('parking_spaces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parking_lot_id')->constrained()->onDelete('cascade');
            $table->string('space_number');
            $table->string('space_type')->default('regular'); // regular, handicap, reserved, nonParking
            $table->boolean('is_occupied')->default(false);
            $table->string('vehicle_type')->nullable(); // auto, moto, camioneta, otro
            $table->string('license_plate')->nullable();
            $table->integer('row')->nullable();
            $table->integer('column')->nullable();
            $table->integer('floor')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            // Asegurar que el número de espacio sea único dentro del mismo estacionamiento
            $table->unique(['parking_lot_id', 'space_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parking_spaces');
    }
};
