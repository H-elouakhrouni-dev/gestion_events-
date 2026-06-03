<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_utilisateur');
            $table->unsignedBigInteger('id_evenement');
            $table->integer('note')->min(1)->max(5);
            $table->longText('commentaire')->nullable();
            $table->timestamp('date_evaluation')->useCurrent();
            $table->timestamps();

            $table->foreign('id_utilisateur')->references('id')->on('utilisateurs')->onDelete('cascade');
            $table->foreign('id_evenement')->references('id')->on('evenements')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
