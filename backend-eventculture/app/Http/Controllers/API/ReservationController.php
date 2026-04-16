<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Evenement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Mail\ReservationConfirmation;
use Illuminate\Support\Facades\Mail;

class ReservationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    // Réserver un billet
    public function store(Request $request)
    {
        try {
            $request->validate([
                'id_evenement' => 'required|exists:evenements,id_evenement',
                'nombre_places' => 'required|integer|min:1'
            ]);

            $userId = auth()->user()->id_utilisateur ?? null;
            
            if (!$userId) {
                return response()->json(['error' => 'Utilisateur non authentifié'], 401);
            }

            $evenement = Evenement::findOrFail($request->id_evenement);

            if ($evenement->places_restantes < $request->nombre_places) {
                return response()->json([
                    'message' => 'Places insuffisantes. Il reste ' . $evenement->places_restantes . ' places.'
                ], 400);
            }

            $reservation = Reservation::create([
                'nombre_places' => $request->nombre_places,
                'date_reservation' => now(),
                'statut' => 'confirme',
                'id_utilisateur' => $userId,
                'id_evenement' => $request->id_evenement,
            ]);

            $evenement->places_restantes -= $request->nombre_places;
            $evenement->save();

            // ✅ Envoi d'email de confirmation
            Mail::to($reservation->utilisateur->email)->send(new ReservationConfirmation($reservation));

            return response()->json($reservation, 201);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Annuler une réservation
    public function annuler($id)
    {
        $reservation = Reservation::findOrFail($id);

        if ($reservation->id_utilisateur !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        DB::beginTransaction();

        try {
            // Rendre les places disponibles
            $evenement = Evenement::findOrFail($reservation->id_evenement);
            $evenement->places_restantes += $reservation->nombre_places;
            $evenement->save();

            $reservation->statut = 'annule';
            $reservation->save();

            DB::commit();

            return response()->json(['message' => 'Réservation annulée']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de l\'annulation'], 500);
        }
    }

    // Mes réservations
    public function mesReservations()
    {
        $reservations = Reservation::with('evenement')
            ->where('id_utilisateur', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reservations);
    }

    // Générer un ticket PDF
    public function genererTicket($id)
    {
        $reservation = Reservation::with(['utilisateur', 'evenement'])
            ->findOrFail($id);

        if ($reservation->id_utilisateur !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $pdf = Pdf::loadView('pdf.ticket', ['reservation' => $reservation]);
        return $pdf->download('ticket_' . $reservation->id_reservation . '.pdf');
    }
}