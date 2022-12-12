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
        $php_curl = curl_init();
        curl_setopt_array($php_curl, array(
            CURLOPT_URL => "https://onlinecode",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_TIMEOUT => 30000,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
            // Set Here Your Laravel curl Requesred Headers
            "accept: */*",
            "accept-language: en-US,en;q=0.8",
            "content-type: application/json",
            ),
        ));
        $final_results = curl_exec($php_curl);
        $err = curl_error($php_curl);
        curl_close($php_curl);

        if ($err) {
            echo "Laravel cURL Error #:" . $err;
        } else {
            print_r(json_decode($final_results));
        }

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
