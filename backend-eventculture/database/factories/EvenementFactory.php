<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Categorie;

class EvenementFactory extends Factory
{
    protected $model = \App\Models\Evenement::class;

    public function definition(): array
    {
        $capacite = $this->faker->numberBetween(50, 500);
        
        return [
            'titre' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'date_debut' => $this->faker->dateTimeBetween('now', '+6 months'),
            'date_fin' => $this->faker->dateTimeBetween('+1 day', '+7 months'),
            'lieu' => $this->faker->city(),
            'prix' => $this->faker->randomFloat(2, 0, 200),
            'capacite' => $capacite,
            'places_restantes' => $capacite,
            'image' => $this->faker->imageUrl(640, 480, 'events', true),
            'statut' => $this->faker->randomElement(['en_attente', 'valide', 'refuse']),
            'date_creation' => now(),
            'id_organisateur' => User::where('role', 'organisateur')->inRandomOrder()->first()->id_utilisateur ?? 1,
            'id_categorie' => Categorie::inRandomOrder()->first()->id_categorie ?? 1,
        ];
    }
}