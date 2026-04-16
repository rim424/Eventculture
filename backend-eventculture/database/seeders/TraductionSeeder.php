<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Traduction;

class TraductionSeeder extends Seeder
{
    public function run(): void
    {
        $traductions = [
            ['cle' => 'bienvenue', 'langue' => 'fr', 'valeur' => 'Bienvenue sur EventCulture'],
            ['cle' => 'bienvenue', 'langue' => 'en', 'valeur' => 'Welcome to EventCulture'],
            ['cle' => 'btn_connexion', 'langue' => 'fr', 'valeur' => 'Se connecter'],
            ['cle' => 'btn_connexion', 'langue' => 'en', 'valeur' => 'Login'],
            ['cle' => 'btn_inscription', 'langue' => 'fr', 'valeur' => "S'inscrire"],
            ['cle' => 'btn_inscription', 'langue' => 'en', 'valeur' => 'Register'],
            ['cle' => 'btn_reserver', 'langue' => 'fr', 'valeur' => 'Réserver'],
            ['cle' => 'btn_reserver', 'langue' => 'en', 'valeur' => 'Book'],
            ['cle' => 'titre_evenements', 'langue' => 'fr', 'valeur' => 'Nos Événements'],
            ['cle' => 'titre_evenements', 'langue' => 'en', 'valeur' => 'Our Events'],
        ];

        foreach ($traductions as $traduction) {
            Traduction::create($traduction);
        }
    }
}