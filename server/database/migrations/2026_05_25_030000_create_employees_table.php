<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->string('sex');           // cast via App\Modules\Personnel\Enums\Sex
            $table->date('dob');
            $table->string('civil_service_eligibility')->nullable();
            $table->string('employment_type'); // cast via App\Modules\Personnel\Enums\EmploymentType
            $table->string('gsis')->nullable();
            $table->string('tin')->nullable();

            // Phase 3 & 6 columns (consolidated)
            $table->string('station_id')->nullable();
            $table->string('nature_of_work')->nullable();
            $table->decimal('monthly_salary', 10, 2)->nullable();
            
            // New columns aligned with Register.tsx
            $table->date('original_appointment_date')->nullable();
            $table->date('last_promotion_date')->nullable();
            $table->string('appointment_status')->nullable(); // Permanent, Temporary, etc.
            $table->date('first_day_of_service')->nullable();
            $table->string('status_of_engagement')->nullable(); // JO, Contractual, etc.
            $table->string('contract_duration')->nullable();
            $table->string('source_of_funds')->nullable();
            
            $table->string('pds_file_path')->nullable();
            $table->string('oath_of_office_file_path')->nullable();
            $table->string('assumption_of_duty_file_path')->nullable();
            $table->foreignId('supervisor_id')->nullable()->constrained('employees')->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
