<?php

namespace App\Providers;

use App\Support\Octane\WindowsPosixExtension;
use App\Support\Octane\WindowsRoadRunnerServerProcessInspector;
use Illuminate\Support\ServiceProvider;
use Laravel\Octane\RoadRunner\ServerProcessInspector as RoadRunnerServerProcessInspector;
use Laravel\Octane\RoadRunner\ServerStateFile as RoadRunnerServerStateFile;
use Laravel\Octane\SymfonyProcessFactory;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (PHP_OS_FAMILY !== 'Windows' || ! class_exists(RoadRunnerServerProcessInspector::class)) {
            return;
        }

        $this->app->bind(RoadRunnerServerProcessInspector::class, function ($app) {
            return new WindowsRoadRunnerServerProcessInspector(
                $app->make(RoadRunnerServerStateFile::class),
                new SymfonyProcessFactory,
                new WindowsPosixExtension,
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
