<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\brand_requests\StoreBrandRequest;
use App\Http\Requests\brand_requests\UpdateBrandRequest;
use App\Models\Brand;

class BrandController extends Controller
{
    public function index()
    {
        $query = Brand::query()->latest();

        if (!request()->boolean('include_inactive')) {
            $query->where('is_active', true);
        }

        return response()->json($query->paginate(15));
    }

    public function store(StoreBrandRequest $request)
    {
        $brand = Brand::create($request->validated());

        return response()->json($brand, 201);
    }

    public function show(Brand $brand)
    {
        return response()->json($brand);
    }

    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $brand->update($request->validated());

        return response()->json($brand->fresh());
    }

    public function destroy(Brand $brand)
    {
        if ($brand->products()->exists()) {
            return response()->json(['message' => 'Brand has linked products.'], 422);
        }

        $brand->delete();

        return response()->json(['message' => 'Brand deleted successfully']);
    }
}
