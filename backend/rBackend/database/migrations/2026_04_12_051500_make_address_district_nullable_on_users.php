<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('users') || DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement('ALTER TABLE `users` MODIFY `address` VARCHAR(255) NULL');
        DB::statement('ALTER TABLE `users` MODIFY `district` VARCHAR(255) NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('users') || DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement('ALTER TABLE `users` MODIFY `address` VARCHAR(255) NOT NULL');
        DB::statement('ALTER TABLE `users` MODIFY `district` VARCHAR(255) NOT NULL');
    }
};
