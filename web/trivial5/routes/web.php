<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PlayedgameController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/dashboard', function () {
//     return view('dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// Route::get('/',function(){
//     return view('welcome');
// });

Route::get('demo/{id}', [GameController::class, 'index_jugar'] );

Route::get('ranking', [UserController::class, 'index'] );

Route::get('daily', [GameController::class, 'index_jugarDaily'] );

Route::post('savegame', [GameController::class, 'store']);
Route::post('saveresult', [PlayedgameController::class, 'store']);

Route::get('register',[AuthController::class,'register']);

require __DIR__.'/auth.php';
