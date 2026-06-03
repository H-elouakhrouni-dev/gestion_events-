<?php

namespace App\Http\Controllers;

use App\Support\ApiResponse;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EvaluationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'id_evenement' => 'required|integer|exists:evenements,id',
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string|max:1000',
        ]);

        $userId = $request->user()->id;

        $participated = DB::table('participations')
            ->where('id_utilisateur', $userId)
            ->where('id_evenement', $request->id_evenement)
            ->where('statut', 'inscrit')
            ->exists();

        if (! $participated) {
            return ApiResponse::error('Vous devez être inscrit à cet événement pour l\'évaluer.', 403);
        }

        try {
            DB::table('evaluations')->insert([
                'id_utilisateur' => $userId,
                'id_evenement' => $request->id_evenement,
                'note' => $request->note,
                'commentaire' => $request->commentaire,
                'date_evaluation' => now(),
            ]);

            return response()->json([
                'message' => 'Évaluation ajoutée avec succès. La moyenne a été mise à jour automatiquement.',
            ], 201);
        } catch (Exception $e) {
            return ApiResponse::dbError('Erreur lors de l\'ajout de l\'évaluation.', $e);
        }
    }
}
