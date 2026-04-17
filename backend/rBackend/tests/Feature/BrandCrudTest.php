<?php
// filepath: c:\Users\user\Documents\GitHub\R-Ecom\backend\rBackend\tests\Feature\BrandCrudTest.php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_brand_crud_flow(): void
    {
        $created = $this->postJson('/api/brands', [
            'name' => 'Nike',
            'slug' => 'nike',
            'is_active' => true,
        ])->assertCreated();

        $id = $created->json('id');

        $this->getJson('/api/brands')->assertOk();
        $this->getJson("/api/brands/{$id}")->assertOk();

        $this->putJson("/api/brands/{$id}", [
            'name' => 'Nike Updated',
            'slug' => 'nike-updated',
        ])->assertOk()->assertJsonPath('name', 'Nike Updated');

        $this->deleteJson("/api/brands/{$id}")
            ->assertOk()
            ->assertJsonPath('message', 'Brand deleted successfully');
    }
}