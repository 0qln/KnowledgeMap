<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nodes = json_decode(file_get_contents(database_path('seeders/data/nodes.json')), true);

        foreach ($nodes as $node) {
            DB::table('nodes')->insert([
                'title' => $node['title'],
                'fullName' => $node['fullName'],
                'description' => $node['description'],
                'isDeleted' => $node['isDeleted'],
            ]);
        }
    }
}
