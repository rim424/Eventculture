<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    // Liste des catégories
    public function index()
    {
        $categories = Categorie::all();
        return response()->json($categories);
    }

    // Détails d'une catégorie
    public function show($id)
    {
        $categorie = Categorie::with('evenements')->findOrFail($id);
        return response()->json($categorie);
    }
}