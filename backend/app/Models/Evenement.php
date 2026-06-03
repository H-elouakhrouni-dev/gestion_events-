<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evenement extends Model
{
    use HasFactory;

    protected $table = 'evenements';

    protected function nbParticipants(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => max(0, (int) $value),
        );
    }

    protected $fillable = [
        'titre',
        'description',
        'date_evenement',
        'lieu',
        'capacite_max',
        'nb_participants',
        'etat',
        'note_moyenne',
    ];

    public function participations()
    {
        return $this->hasMany(Participation::class, 'id_evenement');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'id_evenement');
    }
}
