<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plantilla_item_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('Draft'); // Draft, Published, Closed
            $table->date('posting_date')->nullable();
            $table->date('closing_date')->nullable();
            $table->string('education')->nullable();
            $table->string('experience')->nullable();
            $table->string('training')->nullable();
            $table->string('eligibility')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
