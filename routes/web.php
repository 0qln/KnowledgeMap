<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EdgeController;
use App\Http\Controllers\NodeController;
use App\Http\Controllers\TagController;
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
    Route::get('/dashboard/nodes', [NodeController::class, 'index'])->name('dashboard.nodes');
    Route::get('/dashboard/nodes/create', [NodeController::class, 'create'])->name('dashboard.nodes.create');
    Route::post('/dashboard/nodes/store', [NodeController::class, 'store'])->name('dashboard.nodes.store');
    Route::get('/dashboard/nodes/{node}', [NodeController::class, 'show'])->name('dashboard.nodes.show');
    Route::get('/dashboard/nodes/{node}/edit', [NodeController::class, 'edit'])->name('dashboard.nodes.edit');
    Route::patch('/dashboard/nodes/{node}/edit', [NodeController::class, 'update'])->name('dashboard.nodes.update');
    Route::delete('/dashboard/nodes/{node}/destroy', [NodeController::class, 'destroy'])->name('dashboard.nodes.destroy');
    Route::patch('/dashboard/nodes/{node}/restore', [NodeController::class, 'restore'])->name('dashboard.nodes.restore');

    Route::get('/dashboard/edges', [EdgeController::class, 'index'])->name('dashboard.edges');
    Route::get('/dashboard/edges/create', [EdgeController::class, 'create'])->name('dashboard.edges.create');
    Route::post('/dashboard/edges/store', [EdgeController::class, 'store'])->name('dashboard.edges.store');
    Route::get('/dashboard/edges/{edge}', [EdgeController::class, 'show'])->name('dashboard.edges.show');
    Route::get('/dashboard/edges/{edge}/edit', [EdgeController::class, 'edit'])->name('dashboard.edges.edit');
    Route::patch('/dashboard/edges/{edge}/edit', [EdgeController::class, 'update'])->name('dashboard.edges.update');
    Route::delete('/dashboard/edges/{edge}/destroy', [EdgeController::class, 'destroy'])->name('dashboard.edges.destroy');
    Route::patch('/dashboard/edges/{edge}/restore', [EdgeController::class, 'restore'])->name('dashboard.edges.restore');

    Route::get('/dashboard/tags', [TagController::class, 'index'])->name('dashboard.tags');
    Route::get('/dashboard/tags/{tag}', [TagController::class, 'show'])->name('dashboard.tags.show');
    Route::get('/dashboard/tags/{tag}/edit', [TagController::class, 'edit'])->name('dashboard.tags.edit');
    Route::patch('/dashboard/tags/{tag}/edit', [TagController::class, 'update'])->name('dashboard.tags.update');
    Route::delete('/dashboard/tags/{tag}/destroy', [TagController::class, 'destroy'])->name('dashboard.tags.destroy');
});

Route::get('/auth/redirect', function () {
    return Socialite::driver('azure')->redirect();
})->name('microsoft.login');

Route::get('/auth/callback', [AuthenticatedSessionController::class, 'store']);

require __DIR__.'/auth.php';
