<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Commentaire;
use App\Models\Evenement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentaireController extends Controller
{
    // Ajouter un commentaire
    public function store(Request $request, $evenement_id)
    {
        $request->validate([
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string'
        ]);

        // Vérifier que l'utilisateur a participé à l'événement
        $aParticipe = Reservation::where('id_utilisateur', Auth::id())
            ->where('id_evenement', $evenement_id)
            ->where('statut', 'confirme')
            ->exists();

        if (!$aParticipe) {
            return response()->json(['message' => 'Vous devez participer à cet événement pour le commenter'], 403);
        }

        $commentaire = Commentaire::create([
            'note' => $request->note,
            'commentaire' => $request->commentaire,
            'date_commentaire' => now(),
            'id_utilisateur' => Auth::id(),
            'id_evenement' => $evenement_id,
        ]);

        return response()->json($commentaire, 201);
    }

    // Commentaires d'un événement
    public function index($evenement_id)
    {
        $commentaires = Commentaire::with('utilisateur')
            ->where('id_evenement', $evenement_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($commentaires);
    }

    // Note moyenne d'un événement
    public function moyenne($evenement_id)
    {
        $moyenne = Commentaire::where('id_evenement', $evenement_id)
            ->avg('note');

        return response()->json(['moyenne' => round($moyenne, 1)]);
    }
}