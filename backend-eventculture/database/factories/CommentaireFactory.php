<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Evenement;

class CommentaireFactory extends Factory
{
    protected $model = \App\Models\Commentaire::class;

    public function definition(): array
    {
        return [
            'note' => $this->faker->numberBetween(1, 5),
            'commentaire' => $this->faker->paragraph(),
            'date_commentaire' => now(),
            'id_utilisateur' => User::inRandomOrder()->first()->id_utilisateur ?? 1,
            'id_evenement' => Evenement::inRandomOrder()->first()->id_evenement ?? 1,
        ];
    }
}