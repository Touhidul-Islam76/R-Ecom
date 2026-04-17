<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\products\ProductController;
use App\Http\Controllers\products\ProductReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'message' => 'API is working']);
});

Route::get('/login', function () {
    return response()->json([
        'message' => 'Unauthenticated',
    ], 401);
})->name('login');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/forgot-password/send-otp', [AuthController::class, 'sendForgotPasswordOtp']);
Route::post('/forgot-password/verify-otp', [AuthController::class, 'verifyForgotPasswordOtp']);

Route::group(['prefix' => 'profile'], function (){
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::get('/', [AuthController::class, 'profile']);
        Route::put('/update', [AuthController::class, 'updateProfile']);
        Route::put('/change-password', [AuthController::class, 'changePassword']);
    });
});

Route::middleware(['auth:sanctum', 'role:admin,superAdmin,moderator'])->group(function () {
    Route::apiResource('brands', BrandController::class)->except(['index', 'show']);
    Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    Route::apiResource('products.reviews', ProductReviewController::class)->only(['update']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products.reviews', ProductReviewController::class)->only(['store', 'destroy']);
    Route::get('wishlist', [WishlistController::class, 'index']);
    Route::post('wishlist/items', [WishlistController::class, 'addItem']);
    Route::delete('wishlist/items/{product}', [WishlistController::class, 'removeItem']);
    Route::delete('wishlist/items', [WishlistController::class, 'clear']);
});

Route::apiResource('brands', BrandController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::post('products/{product}/reserve-stock', [ProductController::class, 'reserveVariantStock']);

Route::apiResource('products.reviews', ProductReviewController::class)->only(['index', 'show']);

Route::get('cart', [CartController::class, 'index']);
Route::post('cart/items', [CartController::class, 'addItem']);
Route::patch('cart/items/{item}', [CartController::class, 'updateItem']);
Route::delete('cart/items/{item}', [CartController::class, 'removeItem']);
Route::delete('cart/items', [CartController::class, 'clear']);
