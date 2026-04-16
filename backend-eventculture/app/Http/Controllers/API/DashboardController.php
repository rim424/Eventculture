<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Evenement;
use App\Models\Reservation;
use App\Models\Commentaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    // Dashboard Admin
    public function adminStats()
    {
        $stats = [
            'total_utilisateurs' => User::count(),
            'total_evenements' => Evenement::count(),
            'total_reservations' => Reservation::count(),
            'total_commentaires' => Commentaire::count(),
            'evenements_par_mois' => Evenement::selectRaw('MONTH(date_creation) as mois, COUNT(*) as total')
                ->groupBy('mois')
                ->get(),
            'reservations_par_mois' => Reservation::selectRaw('MONTH(date_reservation) as mois, COUNT(*) as total')
                ->groupBy('mois')
                ->get(),
        ];

        return response()->json($stats);
    }

    // Dashboard Organisateur
    public function organisateurStats()
    {
        $userId = Auth::id();

        $stats = [
            'mes_evenements' => Evenement::where('id_organisateur', $userId)->count(),
            'total_reservations' => Reservation::whereHas('evenement', function($q) use ($userId) {
                $q->where('id_organisateur', $userId);
            })->count(),
            'taux_remplissage' => $this->calculerTauxRemplissage($userId),
            'evenements' => Evenement::withCount('reservations')
                ->where('id_organisateur', $userId)
                ->get()
        ];

        return response()->json($stats);
    }

    private function calculerTauxRemplissage($userId)
    {
        $evenements = Evenement::where('id_organisateur', $userId)->get();
        
        if ($evenements->isEmpty()) return 0;

        $totalCapacite = $evenements->sum('capacite');
        $totalReservations = Reservation::whereHas('evenement', function($q) use ($userId) {
            $q->where('id_organisateur', $userId);
        })->sum('nombre_places');

        return $totalCapacite > 0 ? round(($totalReservations / $totalCapacite) * 100, 2) : 0;
    }
}