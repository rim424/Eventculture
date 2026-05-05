<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Evenement;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class XmlController extends Controller
{
    /**
     * Exporter les événements en XML
     */
    public function export()
    {
        // Vérifier que l'utilisateur est admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $evenements = Evenement::with(['categorie', 'organisateur'])->get();

        // Créer le document XML
        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><evenements></evenements>');

        foreach ($evenements as $event) {
            $item = $xml->addChild('evenement');
            $item->addChild('id', $event->id_evenement);
            $item->addChild('titre', $this->xmlEscape($event->titre));
            $item->addChild('description', $this->xmlEscape($event->description ?? ''));
            $item->addChild('date_debut', $event->date_debut);
            $item->addChild('date_fin', $event->date_fin ?? '');
            $item->addChild('lieu', $this->xmlEscape($event->lieu));
            $item->addChild('prix', $event->prix);
            $item->addChild('capacite', $event->capacite);
            $item->addChild('places_restantes', $event->places_restantes);
            $item->addChild('statut', $event->statut);
            $item->addChild('categorie', $this->xmlEscape($event->categorie->nom ?? ''));
            $item->addChild('organisateur', $this->xmlEscape($event->organisateur->nom ?? '') . ' ' . ($event->organisateur->prenom ?? ''));
        }

        // Retourner le fichier XML
        return response($xml->asXML(), 200)
            ->header('Content-Type', 'application/xml')
            ->header('Content-Disposition', 'attachment; filename="evenements_' . date('Y-m-d') . '.xml"');
    }

    /**
     * Importer des événements depuis un fichier XML
     */
    public function import(Request $request)
    {
        // Vérifier que l'utilisateur est admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'fichier' => 'required|file|mimes:xml|max:2048'
        ]);

        try {
            $file = $request->file('fichier');
            $content = file_get_contents($file->getPathname());
            $xml = simplexml_load_string($content);

            if (!$xml) {
                return response()->json(['message' => 'Fichier XML invalide'], 400);
            }

            $importes = 0;
            $erreurs = [];

            foreach ($xml->evenement as $item) {
                try {
                    // Trouver ou créer la catégorie
                    $categorieNom = (string)$item->categorie;
                    $categorie = Categorie::firstOrCreate(
                        ['nom' => $categorieNom],
                        ['nom' => $categorieNom]
                    );

                    // Créer l'événement
                    $evenement = Evenement::create([
                        'titre' => (string)$item->titre,
                        'description' => (string)$item->description,
                        'date_debut' => (string)$item->date_debut,
                        'date_fin' => (string)$item->date_fin ?: null,
                        'lieu' => (string)$item->lieu,
                        'prix' => (float)$item->prix,
                        'capacite' => (int)$item->capacite,
                        'places_restantes' => (int)$item->capacite,
                        'statut' => 'en_attente',
                        'date_creation' => now(),
                        'id_organisateur' => Auth::id(),
                        'id_categorie' => $categorie->id_categorie,
                    ]);

                    $importes++;
                } catch (\Exception $e) {
                    $erreurs[] = 'Erreur pour l\'événement "' . (string)$item->titre . '" : ' . $e->getMessage();
                }
            }

            return response()->json([
                'message' => "$importes événements importés avec succès",
                'erreurs' => $erreurs
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de l\'import : ' . $e->getMessage()], 500);
        }
    }

    /**
     * Échapper les caractères spéciaux XML
     */
    private function xmlEscape($string)
    {
        return htmlspecialchars($string, ENT_XML1, 'UTF-8');
    }
}