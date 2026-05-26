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
