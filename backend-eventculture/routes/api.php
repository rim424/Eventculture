<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\EvenementController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\CommentaireController;
use App\Http\Controllers\API\CategorieController;
use App\Http\Controllers\API\DashboardController;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/evenements', [EvenementController::class, 'index']);
Route::get('/evenements/{id}', [EvenementController::class, 'show']);
Route::get('/categories', [CategorieController::class, 'index']);
Route::get('/categories/{id}', [CategorieController::class, 'show']);
Route::get('/commentaires/{evenement_id}', [CommentaireController::class, 'index']);
Route::get('/moyenne/{evenement_id}', [CommentaireController::class, 'moyenne']);

// Route temporaire pour les événements en attente (fonctionne sans auth)
Route::get('/test-en-attente', function() {
    $evenements = \App\Models\Evenement::where('statut', 'en_attente')->get();
    return response()->json($evenements);
});

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Réservations
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::put('/reservations/{id}/annuler', [ReservationController::class, 'annuler']);
    Route::get('/mes-reservations', [ReservationController::class, 'mesReservations']);
    Route::get('/ticket/{id}', [ReservationController::class, 'genererTicket']);
    
    // Commentaires
    Route::post('/commentaires/{evenement_id}', [CommentaireController::class, 'store']);
    
    // Événements
    Route::post('/evenements', [EvenementController::class, 'store']);
    Route::put('/evenements/{id}', [EvenementController::class, 'update']);
    Route::delete('/evenements/{id}', [EvenementController::class, 'destroy']);
    
    // Validation des événements (admin)
    Route::put('/evenements/{id}/valider', [EvenementController::class, 'valider']);
    
    // Dashboard
    Route::get('/dashboard/organisateur', [DashboardController::class, 'organisateurStats']);
    Route::get('/dashboard/admin', [DashboardController::class, 'adminStats']);
    Route::post('/evenements/{id}/upload-image', [EvenementController::class, 'uploadImage'])->middleware('auth:sanctum');
});