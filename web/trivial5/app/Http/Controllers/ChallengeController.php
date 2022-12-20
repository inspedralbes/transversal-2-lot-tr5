<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\PlayedGame;
use App\Models\Challenge;
use Illuminate\Support\Facades\DB;

class ChallengeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $completedChallenges = DB::table('played_games')
        ->distinct()
            ->join('challenges',function($join){
                $join->on('played_games.idGame','=','challenges.idGame');
            })
            ->where('challenges.status', '=', 'pending')
            ->get();

        return $completedChallenges;
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
        //ID PARTIDA, ID PERSONA QUE ENVIA, ID PERSONA QUE RECIBE
        $diaActual = date('d/m/Y');

        $challenge = new Challenge();
        $challenge -> idChallenger = $request -> idChallenger;
        $challenge -> idChallenged = $request -> idChallenged;
        $challenge -> idGame = $request -> idGame;
        $challenge -> idWinner = 0;
        $challenge -> date = $request -> date;
        // $challenge -> status = "pending";

        // $playedGame = new PlayedGame();
        // $playedGames -> idUser = $request -> idChallenger;
        // $playedGames -> idGame = $request -> idGame;
        // $playedGames -> date = $request -> date;
        // $playedGames -> score = $request ->score;

        // $playedGames -> save();
        // $user = User::find($playedGames -> idUser);
        // $user -> total_score +=  $playedGames -> score;

        // $user -> save();
        $challenge -> save();
        
        return $challenge;
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
