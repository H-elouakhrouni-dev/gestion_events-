<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('participations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_utilisateur');
            $table->unsignedBigInteger('id_evenement');
            $table->timestamp('date_inscription')->useCurrent();
            $table->enum('statut', ['inscrit', 'annule'])->default('inscrit');
            $table->timestamps();

            $table->unique(['id_utilisateur', 'id_evenement'], 'unique_participation');
            $table->foreign('id_utilisateur')->references('id')->on('utilisateurs')->onDelete('cascade');
            $table->foreign('id_evenement')->references('id')->on('evenements')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('participations');
    }
};
