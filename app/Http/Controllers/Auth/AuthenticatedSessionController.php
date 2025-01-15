<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(): RedirectResponse
    {
        $socialiteUser = Socialite::driver('azure')->user();

        $user = User::updateOrCreate(
            ['email' => $socialiteUser->email],
            ['name' => $socialiteUser->name,]
        );

        Auth::login($user);

        return redirect('dashboard');
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $azureLogoutUrl = Socialite::driver('azure')->getLogoutUrl(route('login'));
        return redirect($azureLogoutUrl);
    }
}
