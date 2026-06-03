<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evenements', function (Blueprint $table) {
            $table->id();
            $table->string('titre', 255);
            $table->longText('description')->nullable();
            $table->dateTime('date_evenement');
            $table->string('lieu', 255);
            $table->integer('capacite_max');
            $table->integer('nb_participants')->default(0);
            $table->enum('etat', ['ouvert', 'complet', 'annule', 'archive'])->default('ouvert');
            $table->decimal('note_moyenne', 3, 2)->default(0.00);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evenements');
    }
};
