<?php

namespace App\Http\Controllers\products;

use App\Http\Controllers\Controller;
use App\Http\Requests\product_requests\ProductReviewRequest;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\JsonResponse;

class ProductReviewController extends Controller
{
	public function index(Product $product): JsonResponse
	{
		$perPage = (int) request('per_page', 5);
		$perPage = max(1, min($perPage, 20));

		$reviews = $product->reviews()
			->with(['user:id,name,image'])
			->where('is_approved', true)
			->latest()
			->paginate($perPage);

		return response()->json($reviews);
	}

	public function store(ProductReviewRequest $request, Product $product): JsonResponse
	{
		$user = $request->user();

		if (! $user) {
			return response()->json(['message' => 'Unauthenticated'], 401);
		}

		$validated = $request->validated();

		$alreadyReviewed = ProductReview::query()
			->where('product_id', $product->id)
			->where('user_id', $user->id)
			->exists();

		if ($alreadyReviewed) {
			return response()->json([
				'message' => 'You already reviewed this product.',
			], 422);
		}

		$isModerator = in_array((string) $user->role, ['admin', 'superAdmin', 'moderator'], true);

		$review = ProductReview::create([
			'product_id' => $product->id,
			'user_id' => $user->id,
			'rating' => $validated['rating'],
			'title' => $validated['title'] ?? null,
			'comment' => $validated['comment'] ?? null,
			'is_approved' => $isModerator,
			'verified_purchase' => false,
			'helpful_count' => 0,
		])->load(['user:id,name,image']);

		$this->syncProductRating($product);

		return response()->json($review, 201);
	}

	public function show(Product $product, ProductReview $review): JsonResponse
	{
		if ($review->product_id !== $product->id) {
			return response()->json(['message' => 'Review not found for this product.'], 404);
		}

		$user = request()->user();
		$isOwner = $user && $review->user_id === $user->id;
		$isModerator = $user && in_array((string) $user->role, ['admin', 'superAdmin', 'moderator'], true);

		if (! $review->is_approved && ! $isOwner && ! $isModerator) {
			return response()->json(['message' => 'Review not found.'], 404);
		}

		return response()->json($review->load(['user:id,name,image', 'product:id,title,slug']));
	}

	public function update(ProductReviewRequest $request, Product $product, ProductReview $review): JsonResponse
	{
		if ($review->product_id !== $product->id) {
			return response()->json(['message' => 'Review not found for this product.'], 404);
		}

		$user = $request->user();

		if (! $user) {
			return response()->json(['message' => 'Unauthenticated'], 401);
		}

		$isModerator = in_array((string) $user->role, ['admin', 'superAdmin', 'moderator'], true);
		$isOwner = $review->user_id === $user->id;

		if (! $isOwner && ! $isModerator) {
			return response()->json(['message' => 'Forbidden'], 403);
		}

		$validated = $request->validated();

		// If review owner edits content, send it back to moderation unless changed by moderator.
		if ($isOwner && ! $isModerator && (array_key_exists('rating', $validated) || array_key_exists('title', $validated) || array_key_exists('comment', $validated))) {
			$validated['is_approved'] = false;
		}

		$review->update($validated);
		$this->syncProductRating($product);

		return response()->json($review->load(['user:id,name,image']));
	}

	public function destroy(\Illuminate\Http\Request $request, Product $product, ProductReview $review): JsonResponse
	{
		if ($review->product_id !== $product->id) {
			return response()->json(['message' => 'Review not found for this product.'], 404);
		}

		$user = $request->user();

		if (! $user) {
			return response()->json(['message' => 'Unauthenticated'], 401);
		}

		$isModerator = in_array((string) $user->role, ['admin', 'superAdmin', 'moderator'], true);
		$isOwner = $review->user_id === $user->id;

		if (! $isOwner && ! $isModerator) {
			return response()->json(['message' => 'Forbidden'], 403);
		}

		$review->delete();
		$this->syncProductRating($product);

		return response()->json([
			'message' => 'Review deleted successfully.',
		]);
	}

	private function syncProductRating(Product $product): void
	{
		$averageRating = ProductReview::query()
			->where('product_id', $product->id)
			->where('is_approved', true)
			->avg('rating');

		$product->update([
			'rating' => $averageRating !== null ? round((float) $averageRating, 1) : 0,
		]);
	}
}
