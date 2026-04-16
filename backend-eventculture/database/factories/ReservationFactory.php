<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Evenement;

class ReservationFactory extends Factory
{
    protected $model = \App\Models\Reservation::class;

    public function definition(): array
    {
        return [
            'nombre_places' => $this->faker->numberBetween(1, 5),
            'date_reservation' => now(),
            'statut' => $this->faker->randomElement(['confirme', 'annule']),
            'code_qr' => null,
            'id_utilisateur' => User::where('role', 'user')->inRandomOrder()->first()->id_utilisateur ?? 1,
            'id_evenement' => Evenement::inRandomOrder()->first()->id_evenement ?? 1,
        ];
    }
}