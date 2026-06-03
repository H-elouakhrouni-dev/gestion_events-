<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        DB::table('utilisateurs')->insert([
            [
                'nom' => 'Admin',
                'prenom' => 'Super',
                'email' => 'admin@example.com',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Doe',
                'prenom' => 'John',
                'email' => 'john@example.com',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'utilisateur',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Smith',
                'prenom' => 'Jane',
                'email' => 'jane@example.com',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'utilisateur',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // Seed Evénements
        DB::table('evenements')->insert([
            [
                'titre' => 'Conférence Tech 2026',
                'description' => 'Une grande conférence sur l\'IA',
                'date_evenement' => '2026-08-15 09:00:00',
                'lieu' => 'Palais des Congrès',
                'capacite_max' => 200,
                'nb_participants' => 0,
                'etat' => 'ouvert',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'titre' => 'Atelier React',
                'description' => 'Atelier pratique sur React JS',
                'date_evenement' => '2026-07-10 14:00:00',
                'lieu' => 'Salle 101',
                'capacite_max' => 20,
                'nb_participants' => 0,
                'etat' => 'ouvert',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'titre' => 'Ancien Événement',
                'description' => 'Événement passé pour tester le curseur',
                'date_evenement' => '2023-01-01 10:00:00',
                'lieu' => 'En ligne',
                'capacite_max' => 50,
                'nb_participants' => 0,
                'etat' => 'ouvert',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
