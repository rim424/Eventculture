<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Evenement;
use App\Models\Reservation;
use App\Models\Commentaire;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    // Dashboard Admin
    public function adminStats()
    {
        // 🔍 DÉBOGAGE
        Log::info('Dashboard admin - User ID: ' . auth()->id());
        Log::info('Dashboard admin - User role: ' . (auth()->user() ? auth()->user()->role : 'non connecté'));
        
        try {
            // Nouvelles statistiques
            $evenementsAttente = Evenement::where('statut', 'en_attente')->count();
            $evenementsSupprimes = Evenement::onlyTrashed()->count();  // ← CORRIGÉ
            $organisateursActifs = User::where('role', 'organisateur')->has('evenements')->count();
            
            // Chiffre d'affaires - CORRIGÉ
            $chiffreAffaires = Reservation::where('reservations.statut', 'confirme')
                ->join('evenements', 'reservations.id_evenement', '=', 'evenements.id_evenement')
                ->sum(DB::raw('reservations.nombre_places * evenements.prix'));
            
            // Taux de remplissage global
            $totalCapacite = Evenement::sum('capacite');
            $totalPlacesVendues = Reservation::where('reservations.statut', 'confirme')->sum('nombre_places');
            $tauxRemplissageGlobal = $totalCapacite > 0 ? round(($totalPlacesVendues / $totalCapacite) * 100, 2) : 0;
            
            // Événements par catégorie
            $evenementsParCategorie = Categorie::withCount('evenements')->get();
            
            // Top 5 événements - CORRIGÉ
            $topEvenements = Evenement::withCount(['reservations' => function($q) {
                $q->where('reservations.statut', 'confirme');
            }])->orderBy('reservations_count', 'desc')->limit(5)->get();
            
            // Top 5 organisateurs
            $topOrganisateurs = User::where('role', 'organisateur')
                ->withCount('evenements')
                ->orderBy('evenements_count', 'desc')
                ->limit(5)
                ->get();

            $stats = [
                'total_utilisateurs' => User::count(),
                'total_evenements' => Evenement::count(),
                'total_reservations' => Reservation::where('reservations.statut', 'confirme')->count(),
                'total_commentaires' => Commentaire::count(),
                'evenements_attente' => $evenementsAttente,
                'evenements_supprimes' => $evenementsSupprimes,
                'organisateurs_actifs' => $organisateursActifs,
                'chiffre_affaires' => round($chiffreAffaires, 2),
                'taux_remplissage' => $tauxRemplissageGlobal,
                'evenements_par_categorie' => $evenementsParCategorie,
                'evenements_par_mois' => Evenement::selectRaw('MONTH(date_creation) as mois, COUNT(*) as total')
                    ->groupBy('mois')
                    ->get(),
                'reservations_par_mois' => Reservation::selectRaw('MONTH(date_reservation) as mois, COUNT(*) as total')
                    ->where('reservations.statut', 'confirme')
                    ->groupBy('mois')
                    ->get(),
                'top_evenements' => $topEvenements,
                'top_organisateurs' => $topOrganisateurs
            ];

            return response()->json($stats);
            
        } catch (\Exception $e) {
            Log::error('Dashboard admin erreur: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Dashboard Organisateur
    public function organisateurStats()
    {
        try {
            $userId = Auth::id();
            
            if (!$userId) {
                return response()->json(['error' => 'Non authentifié'], 401);
            }

            // Nouvelles statistiques
            $evenementsValides = Evenement::where('id_organisateur', $userId)->where('statut', 'valide')->count();
            $evenementsAttente = Evenement::where('id_organisateur', $userId)->where('statut', 'en_attente')->count();
            
            // Chiffre d'affaires - CORRIGÉ
            $chiffreAffaires = Reservation::whereHas('evenement', function($q) use ($userId) {
                $q->where('id_organisateur', $userId);
            })->where('reservations.statut', 'confirme')
            ->join('evenements', 'reservations.id_evenement', '=', 'evenements.id_evenement')
            ->sum(DB::raw('reservations.nombre_places * evenements.prix'));
            
            // Réservations par mois - CORRIGÉ
            $reservationsParMois = Reservation::whereHas('evenement', function($q) use ($userId) {
                $q->where('id_organisateur', $userId);
            })->where('reservations.statut', 'confirme')
            ->select(DB::raw('MONTH(date_reservation) as mois'), DB::raw('COUNT(*) as total'))
            ->groupBy('mois')
            ->get();

            $stats = [
                'mes_evenements' => Evenement::where('id_organisateur', $userId)->count(),
                'evenements_valides' => $evenementsValides,
                'evenements_attente' => $evenementsAttente,
                'total_reservations' => Reservation::whereHas('evenement', function($q) use ($userId) {
                    $q->where('id_organisateur', $userId);
                })->where('reservations.statut', 'confirme')->count(),
                'chiffre_affaires' => round($chiffreAffaires, 2),
                'taux_remplissage' => $this->calculerTauxRemplissage($userId),
                'reservations_par_mois' => $reservationsParMois,
                'evenements' => Evenement::withCount(['reservations' => function($q) {
                    $q->where('reservations.statut', 'confirme');
                }])->where('id_organisateur', $userId)->get()
            ];

            return response()->json($stats);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function calculerTauxRemplissage($userId)
    {
        $evenements = Evenement::where('id_organisateur', $userId)->get();
        
        if ($evenements->isEmpty()) return 0;

        $totalCapacite = $evenements->sum('capacite');
        $totalReservations = Reservation::whereHas('evenement', function($q) use ($userId) {
            $q->where('id_organisateur', $userId);
        })->where('reservations.statut', 'confirme')->sum('nombre_places');

        return $totalCapacite > 0 ? round(($totalReservations / $totalCapacite) * 100, 2) : 0;
    }
}