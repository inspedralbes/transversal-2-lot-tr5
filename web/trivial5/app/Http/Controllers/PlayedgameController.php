<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PlayedGame;
use App\Models\User;
use App\Models\Game;
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
        //devolver tambien por id la categoria i dificultat del juego
        // $recordDetailed = Game::select('category','difficulty')->where('id','=',PlayedGame::value('idGame'));

        return json_encode($record);
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

        penalizarJugador($idUser, $idGame);
    }

    public function update(Request $request){
        $updateScore = DB::table('played_games')
            ->where('idUser', '=', $request -> idUser)
            ->where('idGame', '=', $request -> idGame)
            ->first();

        $updateScore -> score = $request -> score + 300;
        $updateScore -> save();

        return $updateScore -> idUser;
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
