<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EdgeController;
use App\Http\Controllers\NodeController;
use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => false,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/nodes/{node}', [NodeController::class, 'show'])->name('dashboard.nodes.show');
    Route::get('/dashboard/nodes/{node}/edit', [NodeController::class, 'edit'])->name('dashboard.nodes.edit');
    Route::patch('/dashboard/nodes/{node}/edit', [NodeController::class, 'update'])->name('dashboard.nodes.update');

    Route::get('/dashboard/edges/{edge}', [EdgeController::class, 'show'])->name('dashboard.edges.show');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/auth/redirect', function () {
    return Socialite::driver('azure')->redirect();
})->name('microsoft.login');

Route::get('/auth/callback', [AuthenticatedSessionController::class, 'handleMicrosoftCallback']);

require __DIR__.'/auth.php';
