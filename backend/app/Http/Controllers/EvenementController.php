<?php

namespace App\Http\Controllers;

use App\Models\Evenement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EvenementController extends Controller
{
    public function index()
    {
        $evenements = Evenement::orderBy('date_evenement', 'desc')->get();

        return response()->json($evenements);
    }

    public function show($id)
    {
        $evenement = Evenement::findOrFail($id);

        $placesRestantes = DB::selectOne('SELECT fct_places_disponibles(?) AS places_restantes', [$id]);

        $evenement->places_restantes = $placesRestantes->places_restantes;

        return response()->json($evenement);
    }

    public function participants($id)
    {
        $evenement = Evenement::findOrFail($id);

        $participants = DB::table('participations as p')
            ->join('utilisateurs as u', 'p.id_utilisateur', '=', 'u.id')
            ->where('p.id_evenement', $id)
            ->where('p.statut', 'inscrit')
            ->orderBy('p.date_inscription', 'desc')
            ->get([
                'u.id',
                'u.nom',
                'u.prenom',
                'u.email',
                'p.date_inscription',
            ]);

        return response()->json([
            'evenement' => [
                'id' => $evenement->id,
                'titre' => $evenement->titre,
                'nb_participants' => max(0, (int) $evenement->nb_participants),
                'capacite_max' => $evenement->capacite_max,
            ],
            'participants' => $participants,
            'total' => $participants->count(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_evenement' => 'required|date',
            'lieu' => 'required|string|max:255',
            'capacite_max' => 'required|integer|min:1',
        ]);

        $evenement = Evenement::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'date_evenement' => $request->date_evenement,
            'lieu' => $request->lieu,
            'capacite_max' => $request->capacite_max,
            'nb_participants' => 0,
            'etat' => 'ouvert',
            'note_moyenne' => 0,
        ]);

        return response()->json($evenement, 201);
    }

    public function update(Request $request, $id)
    {
        $evenement = Evenement::findOrFail($id);

        $request->validate([
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'date_evenement' => 'sometimes|required|date',
            'lieu' => 'sometimes|required|string|max:255',
            'capacite_max' => 'sometimes|required|integer|min:1',
            'etat' => 'sometimes|required|string',
        ]);

        $evenement->update($request->only([
            'titre',
            'description',
            'date_evenement',
            'lieu',
            'capacite_max',
            'nb_participants',
            'etat',
            'note_moyenne',
        ]));

        return response()->json($evenement);
    }

    public function destroy($id)
    {
        $evenement = Evenement::findOrFail($id);
        $evenement->delete();

        return response()->json([
            'message' => 'Événement supprimé avec succès.',
        ]);
    }

    public function archiver()
    {
        DB::statement('CALL proc_archiver_evenements_passes()');

        return response()->json([
            'message' => 'Les événements passés ont été archivés avec succès.',
        ]);
    }

    public function annulerEvenement($id)
    {
        try {
            DB::statement('CALL proc_notifier_annulation(?)', [$id]);

            return response()->json([
                'message' => 'Événement annulé et participants notifiés.',
            ]);
        } catch (\Exception $e) {
            return \App\Support\ApiResponse::dbError('Erreur lors de l\'annulation.', $e);
        }
    }

    public function stats()
    {
        DB::statement('CALL proc_generer_stats_globales()');

        $logs = DB::table('logs_actions')
            ->where('action', 'LIKE', '%STAT%')
            ->orderBy('date_action', 'desc')
            ->get();

        return response()->json([
            'message' => 'Statistiques générées avec succès.',
            'logs' => $logs,
        ]);
    }
}
