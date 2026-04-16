<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commentaire extends Model
{
    use HasFactory;

     protected $table = 'commentaires';
    protected $primaryKey = 'id_commentaire';

    protected $fillable = [
        'note', 'commentaire', 'date_commentaire', 
        'id_utilisateur', 'id_evenement'
    ];

    protected $casts = [
        'date_commentaire' => 'datetime',
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
