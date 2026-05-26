<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained()->cascadeOnDelete();
            $table->string('task_name');
            $table->string('assigned_role');
            $table->string('status')->default('Pending');
            $table->text('comments')->nullable();
            $table->foreignId('completed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_tasks');
    }
};
