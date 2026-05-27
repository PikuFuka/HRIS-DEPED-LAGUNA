<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plantilla_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_number')->unique();
            $table->string('position_title');
            $table->unsignedTinyInteger('salary_grade');
            $table->string('status')->default('unfilled'); // cast via App\Modules\Personnel\Enums\PlantillaStatus
            $table->string('position_parenthetical')->nullable();
            $table->boolean('is_reclassified')->default(false);
            $table->string('previous_item_number')->nullable();
            $table->string('tagging_of_item')->nullable(); // Regular, Coterminous, CTI
            $table->integer('step')->nullable();
            $table->decimal('authorized_salary', 10, 2)->nullable();
            $table->decimal('actual_salary', 10, 2)->nullable();
            $table->string('code')->nullable();
            $table->string('type')->nullable();
            $table->string('level')->nullable();
            $table->string('attri')->nullable();
            $table->string('category')->nullable(); // Kinder, Elem, JHS, SHS, etc.
            $table->string('school_id')->nullable();
            $table->string('school_name')->nullable();
            $table->string('actual_deployment')->nullable();
            
            $table->foreignId('employee_id')->nullable()->constrained()->nullOnDelete();
            $table->string('office_assignment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plantilla_items');
    }
};
