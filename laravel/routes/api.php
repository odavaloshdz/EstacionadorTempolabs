<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas para la gestión de empresas
Route::apiResource('companies', CompanyController::class);

// Ruta para verificar que la API está funcionando
Route::get('/ping', function () {
    return response()->json([
        'message' => 'API funcionando correctamente',
        'timestamp' => now()->toDateTimeString()
    ]);
}); 