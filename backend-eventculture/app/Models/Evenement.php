<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evenement extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    protected $table = 'evenements';
    protected $primaryKey = 'id_evenement';

    protected $fillable = [
        'titre', 'description', 'date_debut', 'date_fin', 'lieu', 
        'prix', 'capacite', 'places_restantes', 'image', 'statut', 
        'date_creation', 'id_organisateur', 'id_categorie',
        'latitude', 'longitude'  // ← AJOUT
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'date_creation' => 'datetime',
    ];

    // Relation avec l'organisateur (utilisateur)
    public function organisateur()
    {
        return $this->belongsTo(User::class, 'id_organisateur', 'id_utilisateur');
    }

    // Relation avec la catégorie
    public function categorie()
    {
        return $this->belongsTo(Categorie::class, 'id_categorie', 'id_categorie');
    }
    
    // Relation avec les réservations
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_evenement', 'id_evenement');
    }

    // Relation avec les commentaires
    public function commentaires()
    {
        return $this->hasMany(Commentaire::class, 'id_evenement', 'id_evenement');
    }
}