<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductReviewSeeder extends Seeder
{
    private const MIN_REVIEWS_PER_PRODUCT = 10;

    /**
     * Seed the product reviews table with dummy data.
     */
    public function run(): void
    {
        $faker = fake();
        $users = $this->ensureReviewUsers();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            return;
        }

        $reviewCount = 0;

        foreach ($products as $product) {
            $existingUserIds = ProductReview::query()
                ->where('product_id', $product->id)
                ->pluck('user_id')
                ->map(fn ($id) => (int) $id)
                ->all();

            $existingUserLookup = array_flip($existingUserIds);
            $missingCount = max(0, self::MIN_REVIEWS_PER_PRODUCT - count($existingUserIds));

            if ($missingCount === 0) {
                continue;
            }

            $candidateUsers = $users->shuffle()->filter(
                fn (User $user) => ! isset($existingUserLookup[$user->id])
            )->take($missingCount);

            foreach ($candidateUsers as $candidateUser) {
                ProductReview::create([
                    'user_id' => $candidateUser->id,
                    'product_id' => $product->id,
                    'rating' => $faker->randomFloat(1, 1, 5),
                    'title' => ucfirst($faker->words($faker->numberBetween(2, 5), true)),
                    'comment' => $faker->paragraphs($faker->numberBetween(1, 3), true),
                    'is_approved' => true,
                    'verified_purchase' => $faker->boolean(70),
                    'helpful_count' => $faker->numberBetween(0, 75),
                ]);

                $reviewCount++;
            }
        }

        $this->command->info("Created {$reviewCount} product reviews. Minimum ".self::MIN_REVIEWS_PER_PRODUCT." reviews per product ensured.");
    }

    private function ensureReviewUsers()
    {
        $minimumUsers = self::MIN_REVIEWS_PER_PRODUCT;

        for ($i = 1; $i <= $minimumUsers; $i++) {
            User::query()->updateOrCreate([
                'email' => "customer{$i}@example.com",
            ], [
                'name' => "Customer {$i}",
                'phone' => '0180000'.str_pad((string) $i, 4, '0', STR_PAD_LEFT),
                'address' => 'Dhaka',
                'district' => 'Dhaka',
                'password' => 'password',
                'role' => 'customer',
            ]);
        }

        return User::query()->where('role', '!=', 'admin')->get();
    }
}
