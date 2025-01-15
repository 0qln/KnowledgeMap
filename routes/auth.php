<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

Route::get('/auth/redirect', function () {
    return Socialite::driver('azure')->redirect();
})->name('microsoft.login');

Route::get('/auth/callback', [AuthenticatedSessionController::class, 'store']);

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create']) ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
