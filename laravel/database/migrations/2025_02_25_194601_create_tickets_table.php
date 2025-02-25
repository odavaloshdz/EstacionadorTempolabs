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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parking_lot_id')->constrained()->onDelete('cascade');
            $table->foreignId('parking_space_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('closed_by')->nullable()->constrained('users');
            $table->string('ticket_number')->unique();
            $table->string('license_plate');
            $table->string('vehicle_type')->default('auto'); // auto, moto, camioneta, otro
            $table->string('vehicle_color')->nullable();
            $table->string('vehicle_model')->nullable();
            $table->dateTime('entry_time');
            $table->dateTime('exit_time')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('status')->default('active'); // active, closed, canceled
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
