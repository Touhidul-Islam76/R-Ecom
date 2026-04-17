<?php

namespace App\Http\Controllers;

use App\Http\Requests\cart_requests\AddCartItemRequest;
use App\Http\Requests\cart_requests\UpdateCartItemRequest;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CartController extends Controller
{
    private const GUEST_CART_LIFETIME_DAYS = 30;

    public function index(Request $request)
    {
        $cart = $this->resolveCartForRequest($request);

        return response()->json([
            'message' => 'Cart loaded successfully.',
            'data' => $this->transformCart($cart),
        ]);
    }

    public function addItem(AddCartItemRequest $request)
    {
        $cart = $this->resolveCartForRequest($request);
        $validated = $request->validated();

        $product = Product::query()->findOrFail((int) $validated['product_id']);
        [$size, $color, $variant] = $this->resolveVariantSelection($product, $validated);
        $quantity = max(1, (int) $validated['quantity']);
        $optionKey = $this->makeOptionKey($size, $color);
        $unitPrice = $this->resolveUnitPrice($product, $variant);

        DB::transaction(function () use ($cart, $product, $variant, $size, $color, $optionKey, $unitPrice, $quantity) {
            $existing = CartItem::query()
                ->where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->where('option_key', $optionKey)
                ->lockForUpdate()
                ->first();

            if ($existing) {
                $existing->increment('quantity', $quantity);
                return;
            }

            $cart->items()->create([
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'title' => $product->title,
                'image' => $product->image,
                'size' => $size,
                'color' => $color,
                'option_key' => $optionKey,
                'unit_price' => $unitPrice,
                'quantity' => $quantity,
            ]);
        });

        return response()->json([
            'message' => 'Item added to cart.',
            'data' => $this->transformCart($cart->fresh()),
        ]);
    }

    public function updateItem(UpdateCartItemRequest $request, CartItem $item)
    {
        $cart = $this->resolveCartForRequest($request);
        $this->ensureItemBelongsToCart($item, $cart);

        $item->update([
            'quantity' => max(1, (int) $request->validated('quantity')),
        ]);

        return response()->json([
            'message' => 'Cart item quantity updated.',
            'data' => $this->transformCart($cart->fresh()),
        ]);
    }

    public function removeItem(Request $request, CartItem $item)
    {
        $cart = $this->resolveCartForRequest($request);
        $this->ensureItemBelongsToCart($item, $cart);

        $item->delete();

        return response()->json([
            'message' => 'Cart item removed.',
            'data' => $this->transformCart($cart->fresh()),
        ]);
    }

    public function clear(Request $request)
    {
        $cart = $this->resolveCartForRequest($request);
        $cart->items()->delete();

        return response()->json([
            'message' => 'Cart cleared successfully.',
            'data' => $this->transformCart($cart->fresh()),
        ]);
    }

    private function ensureItemBelongsToCart(CartItem $item, Cart $cart): void
    {
        if ((int) $item->cart_id !== (int) $cart->id) {
            abort(404);
        }
    }

    private function resolveCartForRequest(Request $request): Cart
    {
        $user = auth('sanctum')->user();
        $guestToken = $this->extractGuestToken($request);
        $shouldMergeGuestCart = $this->shouldMergeGuestCart($request);

        if ($user) {
            return DB::transaction(function () use ($user, $guestToken, $shouldMergeGuestCart) {
                $userCart = Cart::query()
                    ->where('user_id', $user->id)
                    ->lockForUpdate()
                    ->first();

                if (! $userCart) {
                    $userCart = Cart::query()->create([
                        'user_id' => $user->id,
                    ]);
                }

                if ($guestToken !== null && $shouldMergeGuestCart) {
                    $this->mergeGuestCartIntoUserCart($guestToken, $userCart);
                }

                // User carts must not keep a guest token; otherwise guests may see user cart after logout.
                if ($userCart->guest_token !== null) {
                    $userCart->update(['guest_token' => null]);
                }

                return $userCart->fresh();
            });
        }

        if ($guestToken === null) {
            throw ValidationException::withMessages([
                'guest_token' => ['Guest token is required for guest cart operations.'],
            ]);
        }

        return $this->resolveGuestCart($guestToken);
    }

    private function shouldMergeGuestCart(Request $request): bool
    {
        $flag = mb_strtolower(trim((string) $request->header('X-Merge-Guest-Cart', '')));

        return in_array($flag, ['1', 'true', 'yes'], true);
    }

    private function resolveGuestCart(string $guestToken): Cart
    {
        return DB::transaction(function () use ($guestToken) {
            $cutoff = now()->subDays(self::GUEST_CART_LIFETIME_DAYS);

            // Safety cleanup for legacy data where a user cart kept a guest token.
            $conflictingUserCart = Cart::query()
                ->whereNotNull('user_id')
                ->where('guest_token', $guestToken)
                ->lockForUpdate()
                ->first();

            if ($conflictingUserCart) {
                $conflictingUserCart->update(['guest_token' => null]);
            }

            $guestCart = Cart::query()
                ->whereNull('user_id')
                ->where('guest_token', $guestToken)
                ->lockForUpdate()
                ->first();

            if ($guestCart && $guestCart->updated_at && $guestCart->updated_at->lt($cutoff)) {
                $guestCart->delete();
                $guestCart = null;
            }

            if (! $guestCart) {
                $guestCart = Cart::query()->create([
                    'user_id' => null,
                    'guest_token' => $guestToken,
                ]);
            }

            return $guestCart;
        });
    }

    private function extractGuestToken(Request $request): ?string
    {
        $token = trim((string) $request->header('X-Guest-Token', ''));

        if ($token === '') {
            return null;
        }

        return mb_substr($token, 0, 80);
    }

    private function mergeGuestCartIntoUserCart(string $guestToken, Cart $userCart): void
    {
        $guestCart = Cart::query()
            ->whereNull('user_id')
            ->where('guest_token', $guestToken)
            ->where('id', '!=', $userCart->id)
            ->lockForUpdate()
            ->first();

        if (! $guestCart) {
            return;
        }

        $userCartItems = CartItem::query()
            ->where('cart_id', $userCart->id)
            ->get()
            ->keyBy(fn (CartItem $item) => $this->buildMergeKey((int) $item->product_id, (string) $item->option_key));

        $guestCartItems = CartItem::query()
            ->where('cart_id', $guestCart->id)
            ->get();

        foreach ($guestCartItems as $guestItem) {
            $mergeKey = $this->buildMergeKey((int) $guestItem->product_id, (string) $guestItem->option_key);
            $existing = $userCartItems->get($mergeKey);

            if ($existing) {
                $existing->increment('quantity', max(1, (int) $guestItem->quantity));
                continue;
            }

            $newItem = $guestItem->replicate();
            $newItem->cart_id = $userCart->id;
            $newItem->save();

            $userCartItems->put($mergeKey, $newItem);
        }

        $guestCart->delete();
    }

    private function buildMergeKey(int $productId, string $optionKey): string
    {
        return $productId.'|'.$optionKey;
    }

    /**
     * @param array<string, mixed> $validated
     * @return array{0:?string, 1:?string, 2:?ProductVariant}
     */
    private function resolveVariantSelection(Product $product, array $validated): array
    {
        $size = strtoupper(trim((string) ($validated['size'] ?? '')));
        $color = trim((string) ($validated['color'] ?? ''));

        if ($size === '' && $color === '') {
            if ($product->variants()->exists()) {
                throw ValidationException::withMessages([
                    'size' => ['Please select product size and color.'],
                ]);
            }

            return [null, null, null];
        }

        $variant = ProductVariant::query()
            ->where('product_id', $product->id)
            ->where('size', $size)
            ->whereRaw('LOWER(color) = ?', [mb_strtolower($color)])
            ->first();

        if (! $variant) {
            throw ValidationException::withMessages([
                'size' => ['Selected product option is invalid.'],
            ]);
        }

        return [$variant->size, $variant->color, $variant];
    }

    private function resolveUnitPrice(Product $product, ?ProductVariant $variant): float
    {
        if (! $variant) {
            return (float) $product->price;
        }

        $discount = (float) ($variant->discount_price ?? 0);
        if ($discount > 0) {
            return $discount;
        }

        return (float) $variant->price;
    }

    private function makeOptionKey(?string $size, ?string $color): string
    {
        return mb_strtolower(trim((string) $size)).'|'.mb_strtolower(trim((string) $color));
    }

    /**
     * @return array<string, mixed>
     */
    private function transformCart(Cart $cart): array
    {
        $cart->loadMissing(['items.product', 'items.productVariant']);

        $items = $cart->items
            ->map(function (CartItem $item): array {
                $quantity = max(1, (int) $item->quantity);
                $unitPrice = (float) $item->unit_price;

                return [
                    'id' => (int) $item->id,
                    'product_id' => (int) $item->product_id,
                    'product_variant_id' => $item->product_variant_id ? (int) $item->product_variant_id : null,
                    'title' => trim((string) ($item->title ?: $item->product?->title ?: 'Product')),
                    'image' => $item->product?->image_url ?: ($item->image ?: '/assets/default/profile4.jpg'),
                    'price' => $unitPrice,
                    'size' => $item->size,
                    'color' => $item->color,
                    'quantity' => $quantity,
                    'line_total' => round($unitPrice * $quantity, 2),
                ];
            })
            ->values();

        $totalItems = (int) $items->sum(fn (array $item) => (int) $item['quantity']);
        $subtotal = (float) $items->sum(fn (array $item) => (float) $item['line_total']);

        return [
            'id' => (int) $cart->id,
            'user_id' => $cart->user_id ? (int) $cart->user_id : null,
            'guest_token' => $cart->guest_token,
            'total_items' => $totalItems,
            'subtotal' => round($subtotal, 2),
            'items' => $items->all(),
        ];
    }
}
