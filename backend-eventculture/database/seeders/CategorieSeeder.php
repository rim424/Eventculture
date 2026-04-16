<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categorie;

class CategorieSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Concert', 'Théâtre', 'Exposition', 'Festival', 'Conférence', 'Cinéma'];
        
        foreach ($categories as $categorie) {
            Categorie::create(['nom' => $categorie]);
        }
    }
}