<?php
// filepath: c:\Users\user\Documents\GitHub\R-Ecom\backend\rBackend\tests\Feature\CategoryCrudTest.php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_crud_flow(): void
    {
        $parent = $this->postJson('/api/categories', [
            'name' => 'Men',
            'slug' => 'men',
            'is_active' => true,
        ])->assertCreated();

        $parentId = $parent->json('id');

        $created = $this->postJson('/api/categories', [
            'name' => 'Shirts',
            'slug' => 'shirts',
            'parent_id' => $parentId,
        ])->assertCreated();

        $id = $created->json('id');

        $this->getJson('/api/categories')->assertOk();
        $this->getJson("/api/categories/{$id}")->assertOk();

        $this->putJson("/api/categories/{$id}", [
            'name' => 'Casual Shirts',
            'slug' => 'casual-shirts',
        ])->assertOk()->assertJsonPath('name', 'Casual Shirts');

        $this->deleteJson("/api/categories/{$id}")
            ->assertOk()
            ->assertJsonPath('message', 'Category deleted successfully');
    }
}