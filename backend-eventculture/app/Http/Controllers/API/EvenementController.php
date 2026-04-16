<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Evenement;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EvenementController extends Controller
{
    // Liste des événements (avec filtres)
    public function index(Request $request)
    {
        $query = Evenement::with(['organisateur', 'categorie'])
            ->where('statut', 'valide');

        // Filtre par catégorie
        if ($request->has('categorie')) {
            $query->where('id_categorie', $request->categorie);
        }

        // Filtre par date
        if ($request->has('date')) {
            $query->whereDate('date_debut', $request->date);
        }

        // Recherche par titre
        if ($request->has('search')) {
            $query->where('titre', 'like', '%' . $request->search . '%');
        }

        $evenements = $query->orderBy('date_debut', 'asc')->get();

        return response()->json($evenements);
    }

    // Détails d'un événement
    public function show($id)
    {
        $evenement = Evenement::with(['organisateur', 'categorie', 'commentaires.utilisateur'])
            ->findOrFail($id);

        return response()->json($evenement);
    }

    // Créer un événement (organisateur ou admin)
    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after:date_debut',
            'lieu' => 'required|string|max:255',
            'prix' => 'required|numeric|min:0',
            'capacite' => 'required|integer|min:1',
            'id_categorie' => 'required|exists:categories,id_categorie',
            'image' => 'nullable|string'
        ]);

        $evenement = Evenement::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'lieu' => $request->lieu,
            'prix' => $request->prix,
            'capacite' => $request->capacite,
            'places_restantes' => $request->capacite,
            'image' => $request->image,
            'statut' => 'en_attente',
            'date_creation' => now(),
            'id_organisateur' => Auth::id(),
            'id_categorie' => $request->id_categorie,
        ]);

        return response()->json($evenement, 201);
    }

    // Modifier un événement
    public function update(Request $request, $id)
    {
        $evenement = Evenement::findOrFail($id);

        // Vérifier l'autorisation
        if (Auth::user()->role !== 'admin' && $evenement->id_organisateur !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $evenement->update($request->all());

        return response()->json($evenement);
    }

    // Supprimer un événement
    public function destroy($id)
    {
        $evenement = Evenement::findOrFail($id);

        if (Auth::user()->role !== 'admin' && $evenement->id_organisateur !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $evenement->delete();

        return response()->json(['message' => 'Événement supprimé']);
    }

    // Événements en attente (admin seulement)
    public function enAttente()
{
    // Vérifier que l'utilisateur est admin
    if (!auth()->user() || auth()->user()->role !== 'admin') {
        return response()->json(['message' => 'Non autorisé - Admin uniquement'], 403);
    }

    $evenements = Evenement::with('organisateur')
        ->where('statut', 'en_attente')
        ->get();

    return response()->json($evenements);
}

    // Valider un événement (admin seulement)
    public function valider($id)
    {
        // Vérifier que l'utilisateur est admin
        if (!auth()->user() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé - Admin uniquement'], 403);
        }

        $evenement = Evenement::findOrFail($id);
        $evenement->statut = 'valide';
        $evenement->save();

        return response()->json(['message' => 'Événement validé avec succès']);
    }


    public function uploadImage(Request $request, $id)
{
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
    ]);

    $evenement = Evenement::findOrFail($id);

    // Supprimer l'ancienne image si elle existe
    if ($evenement->image && Storage::exists($evenement->image)) {
        Storage::delete($evenement->image);
    }

    // Enregistrer la nouvelle image
    $path = $request->file('image')->store('evenements', 'public');
    $evenement->image = Storage::url($path);
    $evenement->save();

    return response()->json(['image_url' => $evenement->image]);
}
}