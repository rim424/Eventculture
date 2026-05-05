<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('evenements', function (Blueprint $table) {
            $table->decimal('latitude', 10, 8)->nullable()->after('id_categorie');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
        });
    }

    public function down()
    {
        Schema::table('evenements', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};