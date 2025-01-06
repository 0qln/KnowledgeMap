<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NodeHasTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $relationships = json_decode(file_get_contents(database_path('seeders/data/node_has_tag.json')), true);

        foreach ($relationships as $relationship) {
            DB::table('node_tag')->insert([
                'node_id' => $relationship['nodeIdNode'],
                'tag_id' => $relationship['tagIdTag'],
            ]);
        }
    }
}
