<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('users')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('name');
            }

            if (! Schema::hasColumn('users', 'address')) {
                $table->string('address')->nullable()->after('email');
            }

            if (! Schema::hasColumn('users', 'district')) {
                $table->string('district')->nullable()->after('address');
            }

            if (! Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['admin', 'customer'])->default('customer')->after('password');
            }

            if (! Schema::hasColumn('users', 'otp')) {
                $table->integer('otp')->nullable()->after('role');
            }

            if (! Schema::hasColumn('users', 'otp_expires_at')) {
                $table->timestamp('otp_expires_at')->nullable()->after('otp');
            }
        });

        $users = DB::table('users')->select('id', 'phone')->get();

        foreach ($users as $user) {
            $updates = [];

            if (empty($user->phone)) {
                $updates['phone'] = '019'.str_pad((string) $user->id, 8, '0', STR_PAD_LEFT);
            }

            if ($updates !== []) {
                DB::table('users')->where('id', $user->id)->update($updates);
            }
        }

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE `users` MODIFY `phone` VARCHAR(255) NULL');
            DB::statement('ALTER TABLE `users` MODIFY `email` VARCHAR(255) NULL');
            DB::statement('ALTER TABLE `users` MODIFY `address` VARCHAR(255) NULL');
            DB::statement('ALTER TABLE `users` MODIFY `district` VARCHAR(255) NULL');
            DB::statement('ALTER TABLE `users` MODIFY `password` VARCHAR(255) NULL');
        }

        try {
            Schema::table('users', function (Blueprint $table) {
                $table->unique('phone');
            });
        } catch (Throwable $e) {
            // Ignore when the unique index already exists.
        }

        if (Schema::hasColumn('users', 'email_verified_at') || Schema::hasColumn('users', 'remember_token')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'email_verified_at')) {
                    $table->dropColumn('email_verified_at');
                }

                if (Schema::hasColumn('users', 'remember_token')) {
                    $table->dropColumn('remember_token');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('users')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable()->after('email');
            }

            if (! Schema::hasColumn('users', 'remember_token')) {
                $table->string('remember_token', 100)->nullable()->after('password');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }

            if (Schema::hasColumn('users', 'address')) {
                $table->dropColumn('address');
            }

            if (Schema::hasColumn('users', 'district')) {
                $table->dropColumn('district');
            }

            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }

            if (Schema::hasColumn('users', 'otp')) {
                $table->dropColumn('otp');
            }

            if (Schema::hasColumn('users', 'otp_expires_at')) {
                $table->dropColumn('otp_expires_at');
            }
        });
    }
};
