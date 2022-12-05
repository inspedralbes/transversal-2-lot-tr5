<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(Request $request){
        // $request->validate([
        //     'userName'=>'required',
        //     'userSurname'=>'required',
        //     'userEmail'=>'required|email|unique:users',
        //     'userPassword'=>'required'
        // ])

        // $user = new User();
        // $user->userName = $request->userName;
        // $user->userSurname = $request->userSurname;
        // $user->userPassword = $request->userPassword;
        // $user->save();

        // return response($user, Response::HTTP_CREATED);

        return response()->json([
            "message" => "Alta exitosa"
        ]);
    }

    public function login(Request $request){
        return response()->json([
            "message" => "Login exitosa"
        ]);
    }

    public function userProfile(Request $request){

    }

    public function logout(){

    }

    public function allUsers(){

    }
}
