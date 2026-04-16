<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('traductions', function (Blueprint $table) {
            $table->id('id_traduction');
            $table->string('cle', 100);
            $table->string('langue', 2);
            $table->text('valeur');
            $table->unique(['cle', 'langue']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('traductions');
    }
};
