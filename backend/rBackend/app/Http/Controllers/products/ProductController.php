<?php

namespace App\Http\Controllers\products;

use App\Http\Controllers\Controller;
use App\Http\Requests\product_requests\ReserveProductStockRequest;
use App\Http\Requests\product_requests\StoreProductRequest;
use App\Http\Requests\product_requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function reserveVariantStock(ReserveProductStockRequest $request, Product $product)
    {
        $validated = $request->validated();
        $size = strtoupper(trim((string) $validated['size']));
        $color = trim((string) $validated['color']);
        $requestedQuantity = (int) $validated['quantity'];

        $result = DB::transaction(function () use ($product, $size, $color, $requestedQuantity) {
            $variant = ProductVariant::query()
                ->where('product_id', $product->id)
                ->where('size', $size)
                ->whereRaw('LOWER(color) = ?', [mb_strtolower($color)])
                ->lockForUpdate()
                ->first();

            if (! $variant) {
                return [
                    'ok' => false,
                    'out_of_stock' => [[
                        'size' => $size,
                        'color' => $color,
                        'requested_quantity' => $requestedQuantity,
                        'available_quantity' => 0,
                    ]],
                ];
            }

            if ((int) $variant->quantity < $requestedQuantity) {
                return [
                    'ok' => false,
                    'out_of_stock' => [[
                        'size' => $variant->size,
                        'color' => $variant->color,
                        'requested_quantity' => $requestedQuantity,
                        'available_quantity' => (int) $variant->quantity,
                    ]],
                ];
            }

            $variant->decrement('quantity', $requestedQuantity);
            $variant->refresh();

            return [
                'ok' => true,
                'variant' => $variant,
            ];
        });

        if (! $result['ok']) {
            return response()->json([
                'message' => 'Selected variant is out of stock.',
                'out_of_stock' => $result['out_of_stock'],
            ], 422);
        }

        return response()->json([
            'message' => 'Stock reserved successfully.',
            'variant' => $result['variant'],
        ]);
    }

    public function index()
    {
        $perPage = (int) request('per_page', 12);
        $perPage = max(1, min($perPage, 50));

        $query = Product::with(['category', 'brand', 'variants']);
        if (!request()->boolean('include_inactive')) {
            $query->where('is_active', true);
        }

        if ($search = request('search')) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        if ($categoryIds = $this->normalizeFilterValues(request('category_id'))) {
            $query->whereIn('category_id', $categoryIds);
        }

        if ($brandIds = $this->normalizeFilterValues(request('brand_id'))) {
            $query->whereIn('brand_id', $brandIds);
        }

        if ($sizes = $this->normalizeFilterValues(request('size'))) {
            $query->whereHas('variants', fn (Builder $q) => $q->whereIn('size', $sizes));
        }

        if ($colors = $this->normalizeFilterValues(request('color'))) {
            $query->whereHas('variants', fn (Builder $q) => $q->whereIn('color', $colors));
        }

        if (request()->filled('min_price')) {
            $query->where('price', '>=', (float) request('min_price'));
        }

        if (request()->filled('max_price')) {
            $query->where('price', '<=', (float) request('max_price'));
        }

        match (request('sort')) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'rating_desc' => $query->orderByDesc('rating'),
            default => $query->latest(),
        };

        return response()->json($query->paginate($perPage));
    }

    /**
     * Normalize request filter value(s) into a flat string array.
     *
     * Supports:
     * - single value: ?size=M
     * - comma-separated value: ?size=M,L
     * - array value: ?size[]=M&size[]=L
     *
     * @param mixed $value
     * @return array<int, string>
     */
    private function normalizeFilterValues(mixed $value): array
    {
        if ($value === null) {
            return [];
        }

        $values = is_array($value) ? $value : explode(',', $value);
        $normalized = [];

        foreach ($values as $item) {
            $text = trim((string) $item);
            if ($text !== '') {
                $normalized[] = $text;
            }
        }

        return array_values(array_unique($normalized));
    }

    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();

        $product = DB::transaction(function () use ($validated) {
            $variants = $this->prepareVariants($validated['variants'] ?? []);
            unset($validated['variants']);

            $product = Product::create($validated);
            $product->variants()->createMany($variants);

            return $product->load(['category', 'brand', 'variants']);
        });

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load(['category', 'brand', 'variants']));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();

        $product = DB::transaction(function () use ($product, $validated) {
            $variants = $validated['variants'] ?? null;
            unset($validated['variants']);

            $product->update($validated);

            if (is_array($variants)) {
                $preparedVariants = $this->prepareVariants($variants);

                // Variants table has a unique constraint on (product_id, size, color).
                // Soft-deleted rows still keep that unique key, so we must hard-delete before re-creating.
                ProductVariant::withTrashed()
                    ->where('product_id', $product->id)
                    ->forceDelete();

                $product->variants()->createMany($preparedVariants);
            }

            return $product->load(['category', 'brand', 'variants']);
        });

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        DB::transaction(function () use ($product) {
            ProductVariant::withTrashed()
                ->where('product_id', $product->id)
                ->forceDelete();
            $product->delete();
        });

        return response()->json(['message' => 'Product deleted successfully']);
    }

    /**
     * Normalize and de-duplicate variants by size+color (case-insensitive color).
     *
     * @param array<int, array<string, mixed>> $variants
     * @return array<int, array<string, mixed>>
     */
    private function prepareVariants(array $variants): array
    {
        $normalized = [];

        foreach ($variants as $variant) {
            $size = strtoupper(trim((string) ($variant['size'] ?? '')));
            $color = trim((string) ($variant['color'] ?? ''));

            if ($size === '' || $color === '') {
                continue;
            }

            $key = $size . '|' . mb_strtolower($color);

            $normalized[$key] = [
                'size' => $size,
                'color' => $color,
                'quantity' => (int) ($variant['quantity'] ?? 0),
                'price' => $variant['price'],
                'discount_price' => $variant['discount_price'] ?? null,
            ];
        }

        return array_values($normalized);
    }
}
