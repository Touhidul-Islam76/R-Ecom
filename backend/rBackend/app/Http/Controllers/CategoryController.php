<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\category_requests\StoreCategoryRequest;
use App\Http\Requests\category_requests\UpdateCategoryRequest;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $query = Category::with('parent')->latest();

        if (!request()->boolean('include_inactive')) {
            $query->where('is_active', true);
        }

        return response()->json($query->paginate(15));
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());

        return response()->json($category, 201);
    }

    public function show(Category $category)
    {
        return response()->json($category->load(['parent', 'children']));
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return response()->json($category->fresh(['parent', 'children']));
    }

    public function destroy(Category $category)
    {
        if ($category->children()->exists() || $category->products()->exists()) {
            return response()->json(['message' => 'Category has linked children/products.'], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
