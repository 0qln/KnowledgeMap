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
        Schema::table('edges', function (Blueprint $table) {
            $table->renameColumn('idEdge', 'id');
            $table->renameColumn('idOrigin', 'id_origin');
            $table->renameColumn('idTarget', 'id_target');
            $table->renameColumn('isDeleted', 'is_deleted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
