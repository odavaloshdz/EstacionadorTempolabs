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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->constrained()->after('id');
            $table->string('role')->default('employee')->after('email'); // admin, manager, employee
            $table->string('job_title')->nullable()->after('role');
            $table->string('phone')->nullable()->after('job_title');
            $table->boolean('is_active')->default(true)->after('phone');
            $table->boolean('is_super_admin')->default(false)->after('is_active');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn([
                'company_id',
                'role',
                'job_title',
                'phone',
                'is_active',
                'is_super_admin',
                'deleted_at'
            ]);
        });
    }
};
