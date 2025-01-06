<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = json_decode(file_get_contents(database_path('seeders/data/tags.json')), true);

        foreach ($tags as $tag) {
            DB::table('tags')->insert([
                'name' => $tag['name'],
                'description' => $tag['description'],
                'is_deleted' => $tag['isDeleted'],
            ]);
        }
    }
}
