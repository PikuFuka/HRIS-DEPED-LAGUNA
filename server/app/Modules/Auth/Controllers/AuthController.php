<?php

namespace App\Modules\Auth\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends \App\Http\Controllers\Controller
{
    /**
     * Authenticate the user and start a session.
     *
     * POST /api/login
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        $request->session()->regenerate();

        $user = Auth::user()->load('roles', 'permissions');

        activity()
            ->causedBy($user)
            ->withProperties([
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ])
            ->log('User logged in');

        return response()->json(['user' => $user]);
    }

    /**
     * Destroy the authenticated session.
     *
     * POST /api/logout
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out.']);
    }

    /**
     * Return the currently authenticated user with their Spatie roles & permissions.
     *
     * GET /api/user
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->load('roles', 'permissions')
        );
    }
}
