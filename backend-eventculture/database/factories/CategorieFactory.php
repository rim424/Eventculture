<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategorieFactory extends Factory
{
    protected $model = \App\Models\Categorie::class;

    public function definition(): array
    {
        return [
            'nom' => $this->faker->randomElement([
                'Concert', 'Théâtre', 'Exposition', 'Festival', 'Conférence', 'Cinéma'
            ]),
        ];
    }
}