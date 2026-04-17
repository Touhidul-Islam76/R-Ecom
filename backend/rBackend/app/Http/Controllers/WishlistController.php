<?php

namespace App\Http\Controllers;

use App\Http\Requests\wishlist_requests\AddWishlistItemRequest;
use App\Models\Product;
use App\Models\WishlistItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $user = auth('sanctum')->user();

        $items = WishlistItem::query()
            ->where('user_id', $user->id)
            ->with(['product.variants'])
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'message' => 'Wishlist loaded successfully.',
            'data' => $this->transformItems($items),
        ]);
    }

    public function addItem(AddWishlistItemRequest $request)
    {
        $user = auth('sanctum')->user();
        $productId = (int) $request->validated('product_id');
        Product::query()->findOrFail($productId);

        DB::transaction(function () use ($user, $productId) {
            WishlistItem::query()->firstOrCreate([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
        });

        return $this->index($request);
    }

    public function removeItem(Request $request, Product $product)
    {
        $user = auth('sanctum')->user();

        WishlistItem::query()
            ->where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->delete();

        return $this->index($request);
    }

    public function clear(Request $request)
    {
        $user = auth('sanctum')->user();

        WishlistItem::query()
            ->where('user_id', $user->id)
            ->delete();

        return $this->index($request);
    }

    /**
     * @param \Illuminate\Support\Collection<int, WishlistItem> $items
     * @return array<string, mixed>
     */
    private function transformItems($items): array
    {
        $rows = $items
            ->map(function (WishlistItem $item): array {
                $product = $item->product;

                if (! $product) {
                    return [];
                }

                $price = (float) $product->price;
                $oldPrice = null;

                $discountedVariant = $product->variants
                    ->first(fn ($variant) => (float) ($variant->discount_price ?? 0) > 0);

                if ($discountedVariant) {
                    $price = (float) $discountedVariant->discount_price;
                    $oldPrice = (float) $discountedVariant->price;
                }

                return [
                    'id' => (int) $item->id,
                    'product_id' => (int) $product->id,
                    'title' => trim((string) $product->title),
                    'slug' => (string) $product->slug,
                    'image' => $product->image_url ?: ($product->image ?: '/assets/default/profile4.jpg'),
                    'price' => $price,
                    'old_price' => $oldPrice,
                    'added_at' => $item->created_at?->toISOString(),
                ];
            })
            ->filter(fn (array $item) => ! empty($item))
            ->values();

        return [
            'total_items' => $rows->count(),
            'items' => $rows->all(),
        ];
    }
}
