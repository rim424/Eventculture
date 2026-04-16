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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id('id_reservation');
            $table->integer('nombre_places');
            $table->dateTime('date_reservation');
            $table->enum('statut', ['confirme', 'annule'])->default('confirme');
            $table->string('code_qr', 255)->nullable();
            $table->foreignId('id_utilisateur')->constrained('utilisateurs', 'id_utilisateur')->onDelete('cascade');
            $table->foreignId('id_evenement')->constrained('evenements', 'id_evenement')->onDelete('cascade');
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
        Schema::dropIfExists('reservations');
    }
};
