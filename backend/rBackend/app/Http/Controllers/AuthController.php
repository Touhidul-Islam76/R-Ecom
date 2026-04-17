<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginReq;
use App\Http\Requests\LogoutReq;
use App\Http\Requests\OtpSendReq;
use App\Http\Requests\OtpVerifyReq;
use App\Http\Requests\UpdateProfileReq;
use App\Http\Requests\UserRegisterReq;
use App\Models\Otp;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuthController extends Controller
{

// register part

    public function register(UserRegisterReq $request)
    {
        $validated = $request->validated();
        $imagePath = $request->hasFile('image')
            ? $this->storeProfileImage($request->file('image'))
            : null;

        $user = User::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'image' => $imagePath,
            'password' => $validated['password'],
            'role' => 'customer',
        ]);

        $token = $user->createToken(
            'authToken',
            ['*'],
            now()->addHours(24)
        );

        return $this->successResponse([
            'token' => $token->plainTextToken,
            'user' => $user,
        ], 'User registered successfully', 201);
    }


    // login part

    public function login( LoginReq $request )
    {
        $validated = $request->validated();
        $loginField = isset($validated['phone']) ? 'phone' : 'email';
        $loginValue = $validated[$loginField] ?? null;

        $user = User::where($loginField, $loginValue)->first();

        if (! $user || ! $user->password || ! Hash::check($validated['password'], $user->password)) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        $token = $user->createToken(
            'authToken',
            ['*'],
            now()->addHours(24)
        );

        $accessToken = $token->plainTextToken;

        return $this->successResponse([
            'token' => $accessToken,
            'user' => $user,
        ], 'Login successful');
    }

    // logout part

    public function logout( LogoutReq $req ){
        $user = $req->user();

        if (! $user) {
            return $this->errorResponse('Unauthenticated', 401);
        }

        if ($req->boolean('all_devices')) {
            $user->tokens()->delete();
        } else {
            $token = $user->currentAccessToken();

            if ($token) {
                $token->delete();
            }
        }

        return $this->successResponse(null, 'Logout successful');
    }


    // update profile part

    public function updateProfile(UpdateProfileReq $request)
    {
        $user = $request->user();

        if (! $user) {
            return $this->errorResponse('Unauthenticated', 401);
        }

        $validated = $request->validated();
        $fields = ['name', 'phone', 'email', 'address', 'district'];
        $updateData = [];

        foreach ($fields as $field) {
            if (array_key_exists($field, $validated)) {
                $updateData[$field] = $validated[$field];
            }
        }

        if ($request->hasFile('image')) {
            $this->deleteProfileImage($user->image);
            $updateData['image'] = $this->storeProfileImage($request->file('image'));
        }

        if ($updateData === []) {
            return $this->errorResponse('No profile data provided for update', 422);
        }

        $user->fill($updateData);

        if ($user->isDirty()) {
            $user->save();
        }

        return $this->successResponse([
            'user' => $user->fresh(),
        ], 'Profile updated successfully');
    }


    // forgot password part

    public function sendForgotPasswordOtp(OtpSendReq $request)
    {
        $validated = $request->validated();
        $loginField = isset($validated['phone']) ? 'phone' : 'email';
        $loginValue = $validated[$loginField] ?? null;

        $user = User::where($loginField, $loginValue)->first();

        if (! $user) {
            return $this->errorResponse('User not found', 404);
        }

        $otpCode = (string) random_int(1000, 9999);

        Otp::where($loginField, $loginValue)->delete();

        Otp::create([
            'phone' => $loginField === 'phone' ? $loginValue : null,
            'email' => $loginField === 'email' ? $loginValue : null,
            'otp_code' => $otpCode,
        ]);

        Log::info('Forgot password OTP generated', [
            'sent_via' => $loginField,
            'target' => $loginValue,
            'otp' => $otpCode,
        ]);

        $response = [
            'sent_via' => $loginField,
            'target' => $loginValue,
            'otp' => $otpCode,
        ];

        return $this->successResponse($response, 'OTP sent successfully');
    }

    public function verifyForgotPasswordOtp(OtpVerifyReq $request)
    {
        $validated = $request->validated();
        $loginField = isset($validated['phone']) ? 'phone' : 'email';
        $loginValue = $validated[$loginField] ?? null;

        $user = User::where($loginField, $loginValue)->first();

        if (! $user) {
            return $this->errorResponse('User not found', 404);
        }

        $otpRecord = Otp::query()
            ->where($loginField, $loginValue)
            ->latest('id')
            ->first();

        if (! $otpRecord) {
            return $this->errorResponse('OTP not found', 404);
        }

        $expiresAt = $otpRecord->created_at->copy()->addMinutes(10);

        if (now()->greaterThan($expiresAt)) {
            return $this->errorResponse('OTP expired', 422);
        }

        if (! hash_equals((string) $otpRecord->otp_code, (string) $validated['otp'])) {
            return $this->errorResponse('Invalid OTP', 422);
        }

        if (! empty($validated['password'])) {
            $user->password = $validated['password'];
            $user->save();

            $otpRecord->delete();
            Otp::where($loginField, $loginValue)->delete();

            return $this->successResponse(null, 'OTP verified and password updated');
        }

        return $this->successResponse([
            'verified' => true,
        ], 'OTP verified successfully');
    }

    private function storeProfileImage(UploadedFile $image): string
    {
        $uploadDirectory = public_path('assets/images/userProfile');

        if (! File::isDirectory($uploadDirectory)) {
            File::makeDirectory($uploadDirectory, 0755, true);
        }

        $fileName = 'user_'.now()->format('YmdHis').'_'.Str::random(10).'.'.$image->getClientOriginalExtension();
        $image->move($uploadDirectory, $fileName);

        return 'userProfile/'.$fileName;
    }

    private function deleteProfileImage(?string $imagePath): void
    {
        if (empty($imagePath) || filter_var($imagePath, FILTER_VALIDATE_URL)) {
            return;
        }

        $normalized = ltrim(str_replace('\\', '/', $imagePath), '/');
        $relativePath = null;

        if (str_starts_with($normalized, 'assets/images/userProfile/')) {
            $relativePath = $normalized;
        } elseif (str_starts_with($normalized, 'userProfile/')) {
            $relativePath = 'assets/images/'.$normalized;
        } elseif (! str_contains($normalized, '/')) {
            $relativePath = 'assets/images/userProfile/'.$normalized;
        }

        if (! $relativePath || ! str_starts_with($relativePath, 'assets/images/userProfile/')) {
            return;
        }

        $fullPath = public_path($relativePath);

        if (File::exists($fullPath)) {
            File::delete($fullPath);
        }
    }
}
