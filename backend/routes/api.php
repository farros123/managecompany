<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\UserCustomController;
use App\Http\Controllers\ProjectController;

Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout']);

Route::get('/users', [UserCustomController::class, 'index']);
Route::get('/users/{id}', [UserCustomController::class, 'show']);
Route::post('/users', [UserCustomController::class, 'store']);
Route::put('/users/{id}', [UserCustomController::class, 'update']);
Route::delete('/users/{id}', [UserCustomController::class, 'destroy']);

 Route::get('/projects', [ProjectController::class, 'index']);
Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

    