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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_plan_id')->constrained('subscription_plans');
            $table->string('status')->default('active'); // active, canceled, expired, pending
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();
            $table->dateTime('trial_ends_at')->nullable();
            $table->dateTime('canceled_at')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('billing_cycle');
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
