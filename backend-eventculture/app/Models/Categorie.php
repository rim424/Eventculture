<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    use HasFactory;

    protected $table = 'categories';
    protected $primaryKey = 'id_categorie';

    protected $fillable = ['nom'];

    // Relation avec les événements
    public function evenements()
    {
        return $this->hasMany(Evenement::class, 'id_categorie', 'id_categorie');
    }
}
