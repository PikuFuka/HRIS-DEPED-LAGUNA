<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflows', function (Blueprint $table) {
            $table->id();
            $table->string('reference_no')->unique();
            $table->string('type'); // Onboarding, Promotion, Transfer
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('Draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflows');
    }
};
