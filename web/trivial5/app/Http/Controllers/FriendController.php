<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Friend;
use App\Models\User;
use \stdClass;

class FriendController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $friend = new Friend();
        $sent = 0;
        //si existe email del usuario
        $requestedID = User::where('email',$request->email)->value('id');
        if(User::where('email',$request->email)->exists()){
            if(!(Friend::where('idUserRequested',$request -> id)->exists()&&Friend::where('idUserRequest',$requestedID)->exists())){
                if(!(Friend::where('idUserRequested',$requestedID)->exists()&&Friend::where('idUserRequest',$request -> id)->exists())){
                    $friend -> idUserRequested = $requestedID;
                    $friend -> idUserRequest = $request -> id;
                    $friend -> save();
                    $sent = 1;
                }
            }
        }

        $ret = new stdClass();
        $ret->data = $sent;
        return json_encode($ret);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
