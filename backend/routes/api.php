<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EvenementController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\ParticipationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/evenements', [EvenementController::class, 'index']);
Route::get('/evenements/{id}', [EvenementController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me/participations', [ParticipationController::class, 'myParticipations']);
    Route::post('/participations/inscrire', [ParticipationController::class, 'inscrire']);
    Route::post('/participations/annuler', [ParticipationController::class, 'annuler']);
    Route::post('/evaluations', [EvaluationController::class, 'store']);

    Route::middleware('admin')->group(function () {
        Route::post('/evenements', [EvenementController::class, 'store']);
        Route::get('/evenements/{id}/participants', [EvenementController::class, 'participants']);
        Route::post('/evenements/archiver', [EvenementController::class, 'archiver']);
        Route::post('/evenements/{id}/annuler', [EvenementController::class, 'annulerEvenement']);
        Route::post('/statistiques', [EvenementController::class, 'stats']);
    });
});
