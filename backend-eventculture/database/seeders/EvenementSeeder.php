<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Evenement;

class EvenementSeeder extends Seeder
{
    public function run(): void
    {
        Evenement::factory(20)->create();
    }
}