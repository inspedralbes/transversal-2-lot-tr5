<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();
        $schedule->call(function () {
            $arrayCategories = array("arts_and_literature", "film_and_tv", "food_and_drink", "general_knowledge", "geography", "history", "music", "science", "society_and_culture", "sport_and_leisure");
            $arrayDifficulty = array("easy", "medium", "hard");
            $randomCategory = rand(0, sizeof($arrayCategories));
            $randomDifficulty = rand(0, sizeof($arrayDifficulty));
            $rutaDailyGame = "https://the-trivia-api.com/api/questions?categories="+ $arrayCategories[$randomCategory] + "&limit=10&region=ES&difficulty=easy"+ $arrayDifficulty[$randomDifficulty];
            $curlConn = curl_init($rutaDailyGame);
            $curlResponse = curl_exec($curlConn);
            curl_close($curlConn);

            $actualDay = date('d/m/Y');

            $game = new Game();
            $game->category = $arrayCategories[$randomCategory];
            $game->type = 'game_of_day';
            $game->difficulty = $arrayDifficulty[$randomDifficulty];
            $game->date = $actualDay;
            $game->data = $curlResponse;

            $game->save();
              
        })->daily();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
