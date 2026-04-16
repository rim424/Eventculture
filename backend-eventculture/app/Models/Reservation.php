<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

     protected $table = 'reservations';
    protected $primaryKey = 'id_reservation';

    protected $fillable = [
        'nombre_places', 'date_reservation', 'statut', 'code_qr', 
        'id_utilisateur', 'id_evenement'
    ];

    protected $casts = [
        'date_reservation' => 'datetime',
    ];
    // Relation avec l'utilisateur
    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'id_utilisateur', 'id_utilisateur');
    }

    // Relation avec l'événement
    public function evenement()
    {
        return $this->belongsTo(Evenement::class, 'id_evenement', 'id_evenement');
    }
}
