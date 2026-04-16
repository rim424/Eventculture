<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TraductionFactory extends Factory
{
    protected $model = \App\Models\Traduction::class;

    public function definition(): array
    {
        return [
            'cle' => $this->faker->word(),
            'langue' => $this->faker->randomElement(['fr', 'en']),
            'valeur' => $this->faker->sentence(),
        ];
    }
}