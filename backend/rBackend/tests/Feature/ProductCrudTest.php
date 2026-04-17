<?php
// filepath: c:\Users\user\Documents\GitHub\R-Ecom\backend\rBackend\tests\Feature\ProductCrudTest.php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_crud_flow(): void
    {
        $brand = Brand::create([
            'name' => 'Zara',
            'slug' => 'zara',
            'is_active' => true,
        ]);

        $category = Category::create([
            'name' => 'T-Shirts',
            'slug' => 't-shirts',
            'is_active' => true,
        ]);

        $created = $this->postJson('/api/products', [
            'title' => 'Basic Tee',
            'slug' => 'basic-tee',
            'short_description' => 'Comfort cotton t-shirt',
            'price' => 799,
            'rating' => 4.2,
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'variants' => [
                [
                    'size' => 'M',
                    'color' => 'Black',
                    'quantity' => 15,
                    'price' => 799,
                    'discount_price' => 699,
                ],
            ],
        ])->assertCreated();

        $id = $created->json('id');

        $this->getJson('/api/products')->assertOk();
        $this->getJson('/api/products?search=Basic&size=M&color=Black&sort=price_desc')->assertOk();
        $this->getJson("/api/products/{$id}")->assertOk();

        $this->putJson("/api/products/{$id}", [
            'title' => 'Basic Tee Updated',
            'slug' => 'basic-tee-updated',
            'variants' => [
                [
                    'size' => 'L',
                    'color' => 'White',
                    'quantity' => 10,
                    'price' => 899,
                    'discount_price' => 749,
                ],
            ],
        ])->assertOk()->assertJsonPath('title', 'Basic Tee Updated');

        $this->deleteJson("/api/products/{$id}")
            ->assertOk()
            ->assertJsonPath('message', 'Product deleted successfully');
    }
}