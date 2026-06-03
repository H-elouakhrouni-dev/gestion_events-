<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ParticipationController extends Controller
{
    public function inscrire(Request $request)
    {
        $request->validate([
            'id_evenement' => 'required|integer|exists:evenements,id',
        ]);

        $userId = $request->user()->id;

        try {
            DB::statement('CALL proc_inscrire_utilisateur(?, ?)', [
                $userId,
                $request->id_evenement,
            ]);

            return response()->json(['message' => 'Inscription réussie.'], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'inscription.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function annuler(Request $request)
    {
        $request->validate([
            'id_evenement' => 'required|integer|exists:evenements,id',
        ]);

        $userId = $request->user()->id;

        $wasEnrolled = DB::table('participations')
            ->where('id_utilisateur', $userId)
            ->where('id_evenement', $request->id_evenement)
            ->where('statut', 'inscrit')
            ->exists();

        if (! $wasEnrolled) {
            return response()->json(['message' => 'Aucune inscription active trouvée pour cet événement.'], 404);
        }

        try {
            DB::statement('CALL proc_annuler_inscription(?, ?)', [
                $userId,
                $request->id_evenement,
            ]);

            return response()->json(['message' => 'Inscription annulée avec succès.']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'annulation.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function myParticipations(Request $request)
    {
        try {
            $participations = DB::table('participations')
                ->where('id_utilisateur', $request->user()->id)
                ->where('statut', 'inscrit')
                ->get(['id_evenement']);

            return response()->json($participations);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des participations.',
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
