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
        Schema::create('csc_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('csc_submission_id')->constrained('csc_submissions')->cascadeOnDelete();
            $table->string('action_taken'); // Received/Returned/Approved
            $table->date('action_date');
            $table->text('remarks')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('csc_actions');
    }
};
