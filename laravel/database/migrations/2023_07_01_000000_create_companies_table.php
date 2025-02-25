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
        // Primero añadimos el campo company_id a la tabla users
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('user')->after('password'); // user, admin, super_admin
            }
            if (!Schema::hasColumn('users', 'company_id')) {
                $table->foreignId('company_id')->nullable()->after('role');
            }
        });

        // Luego creamos la tabla companies
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('logo')->nullable();
            $table->string('status')->default('active'); // active, inactive, suspended
            $table->date('subscription_start')->nullable();
            $table->date('subscription_end')->nullable();
            $table->string('subscription_type')->default('basic'); // basic, premium, enterprise
            $table->integer('max_users')->default(5);
            $table->integer('max_parking_spaces')->default(100);
            $table->timestamps();
            $table->softDeletes();
        });

        // Finalmente añadimos la restricción de clave foránea
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar la restricción de clave foránea primero
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
        });

        // Eliminar la tabla companies
        Schema::dropIfExists('companies');

        // Eliminar los campos añadidos a users
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('company_id');
            $table->dropColumn('role');
        });
    }
}; 