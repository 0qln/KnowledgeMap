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
                'id_origin' => $edge['idOrigin'],
                'id_target' => $edge['idTarget'],
                'description' => $edge['description'],
                'weight' => $edge['weight'],
                'is_deleted' => $edge['isDeleted'],
            ]);
        }
    }
}
