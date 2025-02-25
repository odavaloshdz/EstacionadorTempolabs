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
        Schema::create('payment_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained();
            $table->foreignId('ticket_id')->nullable()->constrained();
            $table->string('payment_type'); // subscription, ticket
            $table->decimal('amount', 10, 2);
            $table->string('payment_method')->nullable(); // credit_card, cash, transfer
            $table->string('transaction_id')->nullable();
            $table->string('status'); // completed, pending, failed, refunded
            $table->dateTime('payment_date');
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
        Schema::dropIfExists('payment_history');
    }
};
