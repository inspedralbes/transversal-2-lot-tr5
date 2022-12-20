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
            ->where('challenges.status', '=', 'accepted')
            ->get();

        return $completedChallenges;
    }

    public function index_pending($id) {
        $sql_result='SELECT * FROM challenges JOIN games ON challenges.idGame = games.id JOIN users ON challenges.idChallenger = users.id WHERE challenges.status = "pending" AND challenges.idChallenged = '.$id;
        // $pendingChallenges = DB::select('SELECT * FROM challenges JOIN games ON challenges.idGame = games.id JOIN users ON challenges.idChallenged = users.id WHERE challenges.status = "pending" AND challenges.idChallenged = ?',$id);
        $pendingChallenges = DB::select($sql_result);
        return json_encode($pendingChallenges);
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
        $challenge -> date = $request -> date;
        $challenge -> scoreChallenger +=  $request -> scoreChallenger;
        $challenge -> save();
        return $challenge;
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
        $updateChallenge = DB::table('challenges')
            ->where('idChallenger', '=', $request -> idChallenger)
            ->where('idChallenged', '=', $request -> idChallenged)
            ->update(['status'=>$request->status]);
        return $updateChallenge;
    }

    public function finishChallenge(){
        $finishChallenge = DB::table('challenges')
            ->where('idChallenger', '=', $request -> idChallenger)
            ->where('idChallenged', '=', $request -> idChallenged);

        if($finishChallenge->where('status'->$request->status === 'accepted')){
            $finishChallenge->update(['idWinner' => $id,'status'=>$request->status]);
        }else if($finishChallenge->where('status'->$request->stauts === 'rejected')){
            $finishChallenge->update(['status'=>$request->status]);
        }
        return $finishChallenge;
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
