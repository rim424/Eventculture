<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evenements', function (Blueprint $table) {
            $table->id('id_evenement');
            $table->string('titre', 255);
            $table->text('description')->nullable();
            $table->dateTime('date_debut');
            $table->dateTime('date_fin')->nullable();
            $table->string('lieu', 255);
            $table->decimal('prix', 10, 2)->default(0);
            $table->integer('capacite');
            $table->integer('places_restantes');
            $table->string('image', 255)->nullable();
            $table->enum('statut', ['en_attente', 'valide', 'refuse'])->default('en_attente');
            $table->dateTime('date_creation');
            $table->unsignedBigInteger('id_organisateur');
            $table->unsignedBigInteger('id_categorie');
            $table->timestamps();
        });

        // Ajout des clés étrangères APRÈS la création de la table
        Schema::table('evenements', function (Blueprint $table) {
            $table->foreign('id_organisateur')->references('id_utilisateur')->on('utilisateurs')->onDelete('cascade');
            $table->foreign('id_categorie')->references('id_categorie')->on('categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evenements');
    }
};