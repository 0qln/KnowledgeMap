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
        Schema::create('edges', function (Blueprint $table) {
            $table->id('idEdge');
            $table->unsignedBigInteger('idOrigin');
            $table->unsignedBigInteger('idTarget');
            $table->string('description', 1024)->nullable();
            $table->integer('weight');
            $table->boolean('isDeleted')->default(false);
            $table->timestamps();

            $table->foreign('idOrigin')->references('idNode')->on('nodes')->onDelete('cascade');
            $table->foreign('idTarget')->references('idNode')->on('nodes')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('edges');
    }
};
