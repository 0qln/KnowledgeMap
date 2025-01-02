<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EdgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $edges = json_decode(file_get_contents(database_path('seeders/data/edges.json')), true);

        foreach ($edges as $edge) {
            DB::table('edges')->insert([
                'idOrigin' => $edge['idOrigin'],
                'idTarget' => $edge['idTarget'],
                'description' => $edge['description'],
                'weight' => $edge['weight'],
                'isDeleted' => $edge['isDeleted'],
            ]);
        }
    }
}
