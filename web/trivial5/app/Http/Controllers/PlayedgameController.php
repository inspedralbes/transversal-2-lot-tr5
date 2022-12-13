<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PlayedGame;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PlayedgameController extends Controller
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

    public function index_record($id)
    {
        $record = DB::table('played_games')->where('idUser','=',$id)->limit(10)->get();
        
        return json_encode($record);
        // return $record;
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
        $playedGames = new PlayedGame();
        $playedGames -> idUser = $request -> idUser;
        $playedGames -> idGame = $request -> idGame;
        $playedGames -> date = $request -> date;
        $playedGames -> score = $request ->score;

        $playedGames -> save();
        $user = User::find($playedGames -> idUser);
        $user -> total_score +=  $playedGames -> score;

        $user -> save();

        return $playedGames -> idGame;
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
