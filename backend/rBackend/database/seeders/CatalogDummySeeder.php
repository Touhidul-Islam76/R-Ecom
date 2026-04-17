<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CatalogDummySeeder extends Seeder
{
    /**
     * Seed the application's catalog-related dummy data.
     */
    public function run(): void
    {
        $brandIds = $this->seedBrands();
        $categoryIds = $this->seedCategories();

        $this->seedProducts($brandIds, $categoryIds);
    }

    /**
     * @return array<int, int>
     */
    protected function seedBrands(): array
    {
        $brandNames = [
            'Apex Wear',
            'Urban Loom',
            'North Trail',
            'Velvet Dot',
            'Nimbus Style',
            'Echo Street',
            'EverPeak',
            'Crafted Co',
        ];

        $brandIds = [];

        foreach ($brandNames as $name) {
            $slug = Str::slug($name);

            $brand = Brand::withTrashed()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'image' => 'assets/images/brands/'.$slug.'.jpg',
                    'is_active' => true,
                ]
            );

            if ($brand->trashed()) {
                $brand->restore();
            }

            $brandIds[] = $brand->id;
        }

        return $brandIds;
    }

    /**
     * @return array<int, int>
     */
    protected function seedCategories(): array
    {
        $definitions = [
            ['name' => 'Men', 'parent_slug' => null],
            ['name' => 'Women', 'parent_slug' => null],
            ['name' => 'Kids', 'parent_slug' => null],
            ['name' => 'Accessories', 'parent_slug' => null],
            ['name' => 'Men Shirts', 'parent_slug' => 'men'],
            ['name' => 'Men Pants', 'parent_slug' => 'men'],
            ['name' => 'Women Dresses', 'parent_slug' => 'women'],
            ['name' => 'Women Tops', 'parent_slug' => 'women'],
            ['name' => 'Kids T-Shirts', 'parent_slug' => 'kids'],
            ['name' => 'Bags', 'parent_slug' => 'accessories'],
        ];

        $slugToId = [];

        foreach ($definitions as $item) {
            if ($item['parent_slug'] !== null) {
                continue;
            }

            $slug = Str::slug($item['name']);

            $category = Category::withTrashed()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $item['name'],
                    'parent_id' => null,
                    'image' => 'assets/images/categories/'.$slug.'.jpg',
                    'is_active' => true,
                ]
            );

            if ($category->trashed()) {
                $category->restore();
            }

            $slugToId[$slug] = $category->id;
        }

        foreach ($definitions as $item) {
            if ($item['parent_slug'] === null) {
                continue;
            }

            $slug = Str::slug($item['name']);
            $parentId = $slugToId[$item['parent_slug']] ?? null;

            $category = Category::withTrashed()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $item['name'],
                    'parent_id' => $parentId,
                    'image' => 'assets/images/categories/'.$slug.'.jpg',
                    'is_active' => true,
                ]
            );

            if ($category->trashed()) {
                $category->restore();
            }

            $slugToId[$slug] = $category->id;
        }

        return array_values($slugToId);
    }

    /**
     * @param array<int, int> $brandIds
     * @param array<int, int> $categoryIds
     */
    protected function seedProducts(array $brandIds, array $categoryIds): void
    {
        $sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        $colors = ['Black', 'White', 'Navy', 'Red', 'Green', 'Brown', 'Gray'];
        $adjectives = ['Classic', 'Urban', 'Premium', 'Essential', 'Modern', 'Soft', 'Elite', 'Comfy', 'Daily', 'Fresh'];
        $items = ['Tee', 'Shirt', 'Polo', 'Hoodie', 'Pants', 'Jogger', 'Kurti', 'Dress', 'Jacket', 'Bag'];
        $faker = fake();

        for ($index = 1; $index <= 30; $index++) {
            $adjective = $adjectives[($index - 1) % count($adjectives)];
            $item = $items[intdiv($index - 1, 3) % count($items)];
            $title = $adjective.' '.$item.' '.$index;
            $slug = 'dummy-product-'.str_pad((string) $index, 2, '0', STR_PAD_LEFT);
            $price = round(500 + ($index * 95), 2);
            $rating = min(5, round(3.5 + (($index % 15) * 0.1), 1));

            $product = Product::withTrashed()->updateOrCreate(
                ['slug' => $slug],
                [
                    'title' => $title,
                    'short_description' => $faker->sentence(12),
                    'price' => $price,
                    'rating' => $rating,
                    'image' => 'assets/images/products/'.$slug.'.jpg',
                    'category_id' => $categoryIds[($index - 1) % count($categoryIds)],
                    'brand_id' => $brandIds[($index - 1) % count($brandIds)],
                    'is_active' => true,
                ]
            );

            if ($product->trashed()) {
                $product->restore();
            }

            $variantCount = 2;

            for ($i = 0; $i < $variantCount; $i++) {
                $size = $sizes[($index + $i - 1) % count($sizes)];
                $color = $colors[($index + ($i * 2) - 1) % count($colors)];
                $variantPrice = round($price + (75 * $i), 2);
                $discountPrice = $i === 0 ? round(max(0, $variantPrice - 50), 2) : null;

                $variant = ProductVariant::withTrashed()->updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'size' => $size,
                        'color' => $color,
                    ],
                    [
                        'quantity' => $faker->numberBetween(5, 150),
                        'price' => $variantPrice,
                        'discount_price' => $discountPrice,
                    ]
                );

                if ($variant->trashed()) {
                    $variant->restore();
                }
            }
        }
    }
}
