<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('node_has_tag', function (Blueprint $table) {
            $table->unsignedBigInteger('nodeIdNode');
            $table->unsignedBigInteger('tagIdTag');
            $table->primary(['nodeIdNode', 'tagIdTag']);

            $table->foreign('nodeIdNode')->references('idNode')->on('nodes')->onDelete('cascade');
            $table->foreign('tagIdTag')->references('idTag')->on('tags')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('node_has_tag');
    }
};
