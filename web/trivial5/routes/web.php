<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PlayedgameController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('demo/{id}', [GameController::class, 'index_jugar'] );

Route::get('ranking', [UserController::class, 'index'] );

Route::get('record/{idUser}', [PlayedgameController::class, 'index_record'] );

Route::get('daily/{id}', [GameController::class, 'index_jugarDaily'] );

Route::post('sendfriend', [FriendController::class, 'store']);
Route::post('savegame', [GameController::class, 'store']);
Route::post('saveresult', [PlayedgameController::class, 'store']);

require __DIR__.'/auth.php';
