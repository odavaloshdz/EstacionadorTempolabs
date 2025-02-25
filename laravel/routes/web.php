<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SuperAdmin\CompanyController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\SubscriptionController;
use App\Http\Controllers\SuperAdmin\SubscriptionPlanController;
use App\Http\Controllers\SuperAdmin\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Auth\MustVerifyEmail;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/tickets', function () {
        return Inertia::render('Tickets/Index');
    })->name('tickets.index');

    Route::get('/profile', function () {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => auth()->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    })->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas para el superadmin
Route::middleware(['auth', 'superadmin'])->prefix('superadmin')->name('superadmin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Gestión de empresas
    Route::resource('companies', CompanyController::class);
    
    // Gestión de suscripciones
    Route::get('/subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
    Route::get('/subscriptions/create', [SubscriptionController::class, 'create'])->name('subscriptions.create');
    Route::post('/subscriptions', [SubscriptionController::class, 'store'])->name('subscriptions.store');
    Route::get('/subscriptions/{company}', [SubscriptionController::class, 'show'])->name('subscriptions.show');
    Route::get('/subscriptions/{company}/edit', [SubscriptionController::class, 'edit'])->name('subscriptions.edit');
    Route::put('/subscriptions/{company}', [SubscriptionController::class, 'update'])->name('subscriptions.update');
    
    // Gestión de usuarios superadmin
    Route::resource('users', UserController::class);
});

require __DIR__.'/auth.php';
