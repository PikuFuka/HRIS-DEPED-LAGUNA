<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Modules\Personnel\Models\PlantillaItem;
use App\Modules\Personnel\Observers\PlantillaItemObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        PlantillaItem::observe(PlantillaItemObserver::class);
    }
}
