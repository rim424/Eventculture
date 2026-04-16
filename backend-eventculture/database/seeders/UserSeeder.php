<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin par défaut
        User::create([
            'nom' => 'Admin',
            'prenom' => 'System',
            'email' => 'admin@eventculture.com',
            'mot_de_passe' => Hash::make('admin123'),
            'role' => 'admin',
            'date_inscription' => now(),
        ]);

        // 10 utilisateurs aléatoires
        User::factory(10)->create();
    }
}