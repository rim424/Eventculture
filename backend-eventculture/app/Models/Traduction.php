<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Traduction extends Model
{
    use HasFactory;
    protected $table = 'traductions';
    protected $primaryKey = 'id_traduction';

    protected $fillable = ['cle', 'langue', 'valeur'];
}
