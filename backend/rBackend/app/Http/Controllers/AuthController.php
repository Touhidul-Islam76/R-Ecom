<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginReq;
use App\Http\Requests\LogoutReq;
use App\Http\Requests\OtpSendReq;
use App\Http\Requests\OtpVerifyReq;
use App\Http\Requests\UserRegisterReq;
use App\Models\Otp;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(UserRegisterReq $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'password' => $validated['password'],
            'role' => 'customer',
        ]);

        return $this->successResponse([
            'user' => $user,
        ], 'User registered successfully', 201);
    }


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
}
