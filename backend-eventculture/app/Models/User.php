<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'utilisateurs';
    protected $primaryKey = 'id_utilisateur';

    protected $fillable = [
        'nom', 
        'prenom', 
        'email', 
        'mot_de_passe', 
        'role', 
        'date_inscription'
    ];

    protected $hidden = [
        'mot_de_passe', 
        'remember_token',
    ];

    protected $casts = [
        'date_inscription' => 'datetime',
        'email_verified_at' => 'datetime',
    ];

    public function evenements()
    {
        return $this->hasMany(Evenement::class, 'id_organisateur', 'id_utilisateur');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_utilisateur', 'id_utilisateur');
    }

    public function commentaires()
    {
        return $this->hasMany(Commentaire::class, 'id_utilisateur', 'id_utilisateur');
    }
}