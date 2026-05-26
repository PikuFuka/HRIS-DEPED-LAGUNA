<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plantilla_item_id')->constrained()->cascadeOnDelete();
            $table->string('past_employee_name');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('remarks')->nullable(); // e.g. resigned, transferred, promoted, retired
            $table->string('status')->nullable();   // e.g. newly_created, active_holder
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_histories');
    }
};
