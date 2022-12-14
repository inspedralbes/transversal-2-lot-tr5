<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Friend;
use App\Models\User;
use \stdClass;

use Illuminate\Support\Facades\DB;

class FriendController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $friendsRequested = DB::table('friends')
                    ->distinct()
                    ->leftJoin('users', function($join) 
                    {
                        $join->on('friends.idUserRequested', '=', 'users.id');
                    })
            ->where('idUserRequest', '=', $id)
            ->where('status', '=', 'accepted')
            ->get();

        $friendsRequest = DB::table('friends')
            ->distinct()
            ->leftJoin('users', function($join) 
            {
                $join->on('friends.idUserRequest', '=', 'users.id');
            })
            ->where('idUserRequested', '=', $id)
            ->where('status', '=', 'accepted')
            ->get();

        $allFriends = [];
        
        for ($i=0; $i < count($friendsRequest); $i++) { 
            array_push($allFriends, $friendsRequest[$i]);
        }

        for ($i=0; $i < count($friendsRequested); $i++) { 
            array_push($allFriends, $friendsRequested[$i]);
        }
        
        if(count($allFriends) > 0) {
            return json_encode($allFriends);
        } 
        else {
            return json_encode('sin amigos');
        }
    }


    public function index_pending($id) {
        
        $pendingRequests = DB::table('friends')
                    ->distinct()
                    ->leftJoin('users', function($join) 
                    {
                        $join->on('friends.idUserRequested', '=', 'users.id');
                    })
            ->where('idUserRequest', '=', $id)
            ->where('status', '=', 'pending')
            ->get();

        if(count($pendingRequests) > 0) {
            return json_encode($pendingRequests);
        } 
        else {
            return json_encode('sense peticions');
        }
        

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
        $message = "";
        //si existe email del usuario
        $requestedID = User::where('email',$request->email)->value('id');
        if(User::where('email',$request->email)->exists()){
            error_log("entra if");
            if(!(Friend::where('idUserRequested',$request->id)->exists()&&Friend::where('idUserRequest',$requestedID)->exists())){
                if(!(Friend::where('idUserRequested',$requestedID)->exists()&&Friend::where('idUserRequest',$request -> id)->exists())){
                    $friend -> idUserRequested = $requestedID;
                    $friend -> idUserRequest = $request -> id;
                    $friend -> save();
                    $sent = 1;
                    $message = "Request sent successfully";
                }else{
                    $message = "You have already sent the request to this email";
                }
            }else{
                $message = "This user has already sent the request to you";
            }
        }else{
            $message = "Email not exists";
        }

        // if(Friend::where('idUserRequested',$request -> id)->exists()&&Friend::where('idUserRequest',$requestedID)->exists()){
        //     $message = "This user has already sent the request to you";
        // }elseif(Friend::where('idUserRequested',$requestedID)->exists()&&Friend::where('idUserRequest',$request -> id)->exists()){
        //     $message = "You have already sent the request to this email";
        // }
        
        $ret = new stdClass();
        $ret->data = $sent;
        $ret->message = $message;
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
    public function update(Request $request)
    {
        
        $changeRequestStatus = DB::table('friends')
            ->where('idUserRequest', '=', $request -> idUserRequest)
            ->where('idUserRequested', '=', $request -> idUserRequested)
            ->update(['status' => $request -> status]);

        
        return $changeRequestStatus;
        
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
