<?php

namespace Database\Seeders;

use App\Modules\Personnel\Models\PlantillaItem;
use App\Modules\Workflow\Models\Workflow;
use App\Modules\Workflow\Models\WorkflowTask;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DemoDashboardDataSeeder extends Seeder
{
    public function run(): void
    {
        // This seeder is replaced by ComprehensiveSeeder.
        // Kept for backwards compatibility but does nothing.
        $this->command->info('ℹ️  DemoDashboardDataSeeder skipped — use ComprehensiveSeeder instead.');
    }
}
