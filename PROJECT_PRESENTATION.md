# 📋 GESTION EVENEMENTS - Présentation Projet

---

## 1️⃣ À PROPOS

### Description
**Gestion Evenements** est une plateforme web complète de **gestion et d'organisation d'événements**. Elle permet aux utilisateurs de :

- 📅 **Découvrir** des événements disponibles
- ✅ **S'inscrire/Annuler** leur participation aux événements
- ⭐ **Évaluer** les événements auxquels ils ont participé
- 👥 **Consulter** la liste des participants (administrateurs)
- 📊 **Générer** des statistiques (administrateurs)

### Objectifs Principaux
- ✔️ Centraliser la gestion des événements
- ✔️ Automatiser les inscriptions et annulations
- ✔️ Collecter les évaluations pour améliorer les événements
- ✔️ Fournir un suivi en temps réel de la capacité
- ✔️ Archiver automatiquement les événements passés

### Utilisateurs Cibles
- **Utilisateurs simples** : Inscription, consultation, évaluation
- **Administrateurs** : Création d'événements, gestion, statistiques
- **Organisateurs** : Suivi des participants et des évaluations

---

## 2️⃣ CHOIX TECHNIQUES

### Stack Technologique

| Couche | Technologie | Version | Raison |
|--------|-------------|---------|--------|
| **Backend** | Laravel | 11.x | Framework robuste, ORM Eloquent, authentification intégrée |
| **Frontend** | React | 18.x | SPA moderne, réactivité, composants réutilisables |
| **Build Frontend** | Vite | 5.x | Bundler ultra-rapide, hot reload, optimisation production |
| **Base de Données** | MySQL/SQLite | 8.0 / 3.x | MySQL en dev, SQLite pour déploiement (SQLite en prod HF) |
| **Authentification** | Laravel Sanctum | Latest | Token-based API auth, CORS intégré |
| **Serveur** | Apache 2.4 | 2.4 | Serveur web production, modules PHP intégrés |
| **Containerisation** | Docker | Latest | Déploiement HuggingFace Spaces, isolation d'env |

### Architecture

```
┌─────────────────────────────────────────────────┐
│            FRONTEND (React + Vite)              │
│  - Composants réutilisables                     │
│  - Context API pour l'authentification          │
│  - Axios pour les requêtes API                  │
└─────────────────────┬───────────────────────────┘
                      │ API REST
                      │ JSON
┌─────────────────────▼───────────────────────────┐
│        BACKEND (Laravel + Apache)               │
│  - Contrôleurs RESTful                          │
│  - Middleware d'authentification                │
│  - Procédures stockées MySQL                    │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│    BASE DE DONNEES (MySQL/SQLite)               │
│  - Tables normalisées                           │
│  - Triggers automatiques                        │
│  - Procédures stockées                          │
└─────────────────────────────────────────────────┘
```

### Dépendances Clés

**Backend**
- `laravel/framework` : Core framework
- `laravel/sanctum` : Authentification API
- `laravel/tinker` : REPL pour Laravel

**Frontend**
- `react` : Library UI
- `axios` : HTTP client
- `react-router-dom` : Routage SPA

---

## 3️⃣ RÈGLES DE GESTION

### États des Événements
```
┌─────────┐
│ OUVERT  │ Événement disponible, inscriptions actives
└────┬────┘
     │ [Capacité atteinte]
     ▼
┌─────────┐
│COMPLET  │ Plus de places disponibles
└────┬────┘
     │ [Admin annule]
     ▼
┌─────────┐
│ ANNULE  │ Événement annulé, inscriptions fermées
└────┬────┘
     │ [Date passée]
     ▼
┌─────────┐
│ARCHIVE  │ Événement passé, archivé automatiquement
└─────────┘
```

### Gestion des Inscriptions

| Règle | Détail |
|-------|--------|
| **Unicité** | Un utilisateur ne peut pas s'inscrire 2 fois au même événement |
| **Capacité** | Vérification de la capacité avant inscription |
| **Doublon** | Bloquer si inscription déjà active |
| **Annulation** | Possible jusqu'à la date de l'événement |
| **Automatique** | Mise à jour du nombre de participants via trigger |

### Gestion des Évaluations

| Règle | Détail |
|-------|--------|
| **Condition** | Évaluation possible UNIQUEMENT si inscrit |
| **Échelle** | Note de 1 à 5 étoiles |
| **Commentaire** | Optionnel, max 1000 caractères |
| **Mise à jour** | Moyenne recalculée automatiquement via trigger |
| **Historique** | Évaluations conservées pour traçabilité |

### Archivage Automatique

**Procédure** : `proc_archiver_evenements_passes()`

```sql
-- Exécutée automatiquement tous les jours
-- Archive les événements avec date_evenement < NOW()
-- État: 'ouvert' → 'archive'
```

---

## 4️⃣ LOGO ET PALETTE COULEUR

### Identité Visuelle

```
╔════════════════════════════════════════╗
║                                        ║
║        📅 GESTION EVENEMENTS 📅        ║
║                                        ║
║    Event Management Platform 2026      ║
║                                        ║
╚════════════════════════════════════════╝
```

### Palette de Couleurs

#### Couleurs Principales
```
┌─────────────────────────────────────┐
│ PRIMARY: #0066CC (Bleu)             │ ← Actions principales, boutons
│ SECONDARY: #FF6B35 (Orange)         │ ← Actions secondaires
│ SUCCESS: #22C55E (Vert)             │ ← Confirmations, inscriptions OK
│ DANGER: #EF4444 (Rouge)             │ ← Erreurs, capacité critique
│ WARNING: #F59E0B (Ambre)            │ ← Avertissements, info importante
└─────────────────────────────────────┘
```

#### Couleurs de Fond
```
┌─────────────────────────────────────┐
│ BG-PRIMARY: #FFFFFF (Blanc)         │ ← Fond principal
│ BG-SECONDARY: #F3F4F6 (Gris clair)  │ ← Sections alternées
│ BG-DARK: #1F2937 (Gris foncé)       │ ← Mode sombre (optionnel)
└─────────────────────────────────────┘
```

#### Couleurs de Texte
```
┌─────────────────────────────────────┐
│ TEXT-PRIMARY: #111827 (Noir)        │ ← Texte principal
│ TEXT-SECONDARY: #6B7280 (Gris)      │ ← Texte secondaire
│ TEXT-MUTED: #9CA3AF (Gris clair)    │ ← Texte atténué
└─────────────────────────────────────┘
```

### Thèmes d'État Événement
```
🟢 OUVERT     : Badge vert
🔴 COMPLET    : Badge rouge
⚫ ANNULE     : Badge gris
🟠 ARCHIVE    : Badge orange
```

---

## 5️⃣ DIAGRAMMES

### Diagramme de Flux Utilisateur

```
┌──────────────┐
│  Utilisateur │
└───────┬──────┘
        │
        ├─→ Non authentifié?
        │   ├─→ Inscription
        │   └─→ Connexion
        │
        └─→ Authentifié?
            ├─→ Consulter événements
            │   ├─→ Voir détails
            │   ├─→ S'inscrire
            │   └─→ Annuler inscription
            │
            └─→ Événement participé?
                ├─→ Évaluer (1-5 ⭐)
                └─→ Ajouter commentaire
```

### Diagramme Entité-Relation

```
┌─────────────────────┐
│    UTILISATEURS     │
├─────────────────────┤
│ id (PK)             │
│ nom                 │
│ prenom              │
│ email               │
│ mot_de_passe        │
│ role (user/admin)   │
└────────┬────────────┘
         │
         │ 1:N
         │
    ┌────▼──────────────────┐
    │  PARTICIPATIONS       │
    ├───────────────────────┤
    │ id (PK)               │
    │ id_utilisateur (FK)   │
    │ id_evenement (FK)     │
    │ date_inscription      │
    │ statut(inscrit/annulé)│
    └────┬────────┬────────┘
         │        │
    ┌────▼─┐  ┌───▼──────────┐
    │ N:M  │  │ EVALUATIONS  │
    │      │  ├──────────────┤
    └──────┘  │ id (PK)      │
         │    │ id_utilisateur
         │    │ id_evenement │
         │    │ note (1-5)   │
    ┌────▼────▼────────────┐ │
    │    EVENEMENTS        │ │
    ├──────────────────────┤ │
    │ id (PK)              │◄┘
    │ titre                │
    │ description          │
    │ date_evenement       │
    │ lieu                 │
    │ capacite_max         │
    │ nb_participants      │
    │ etat                 │
    │ note_moyenne         │
    └──────────────────────┘
```

### Diagramme Flux d'Inscription

```
UTILISATEUR                    API                    DATABASE
    │                           │                         │
    ├─ POST /inscrire ────────→ │                         │
    │                           ├─ CALL proc_inscrire ──→ │
    │                           │   - Vérifier unicité    │
    │                           │   - Vérifier capacité   │
    │                           │   - Insérer dans DB    │
    │                           │   - Trigger met à jour │
    │                           │← Succès 201             │
    │← {message: "OK"} ────────┤                         │
    │                           │                         │
```

---

## 6️⃣ FONCTIONS + TRIGGERS + DATABASE

### Base de Données - Tables

#### Table: `utilisateurs`
```sql
CREATE TABLE utilisateurs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('utilisateur', 'admin') DEFAULT 'utilisateur',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Table: `evenements`
```sql
CREATE TABLE evenements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    description LONGTEXT,
    date_evenement DATETIME NOT NULL,
    lieu VARCHAR(255) NOT NULL,
    capacite_max INT NOT NULL,
    nb_participants INT DEFAULT 0,
    etat ENUM('ouvert', 'complet', 'annule', 'archive') DEFAULT 'ouvert',
    note_moyenne DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Table: `participations`
```sql
CREATE TABLE participations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_utilisateur BIGINT NOT NULL,
    id_evenement BIGINT NOT NULL,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('inscrit', 'annule') DEFAULT 'inscrit',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_participation (id_utilisateur, id_evenement),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (id_evenement) REFERENCES evenements(id) ON DELETE CASCADE
);
```

#### Table: `evaluations`
```sql
CREATE TABLE evaluations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_utilisateur BIGINT NOT NULL,
    id_evenement BIGINT NOT NULL,
    note INT NOT NULL CHECK(note >= 1 AND note <= 5),
    commentaire LONGTEXT,
    date_evaluation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (id_evenement) REFERENCES evenements(id) ON DELETE CASCADE
);
```

### Procédures Stockées

#### 1️⃣ `proc_inscrire_utilisateur`
```sql
DELIMITER //
CREATE PROCEDURE proc_inscrire_utilisateur(
    IN p_user_id BIGINT,
    IN p_event_id BIGINT
)
BEGIN
    DECLARE v_capacite_max INT;
    DECLARE v_nb_participants INT;
    
    -- Vérifier la capacité
    SELECT capacite_max, nb_participants 
    INTO v_capacite_max, v_nb_participants
    FROM evenements WHERE id = p_event_id;
    
    IF v_nb_participants >= v_capacite_max THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Capacité dépassée';
    END IF;
    
    -- Insérer la participation
    INSERT INTO participations (id_utilisateur, id_evenement, statut)
    VALUES (p_user_id, p_event_id, 'inscrit');
    
    -- Mise à jour du nombre de participants
    UPDATE evenements 
    SET nb_participants = nb_participants + 1 
    WHERE id = p_event_id;
END //
DELIMITER ;
```

#### 2️⃣ `proc_annuler_inscription`
```sql
DELIMITER //
CREATE PROCEDURE proc_annuler_inscription(
    IN p_user_id BIGINT,
    IN p_event_id BIGINT
)
BEGIN
    -- Marquer comme annulée
    UPDATE participations 
    SET statut = 'annule'
    WHERE id_utilisateur = p_user_id 
    AND id_evenement = p_event_id;
    
    -- Décrémenter le nombre de participants
    UPDATE evenements 
    SET nb_participants = GREATEST(0, nb_participants - 1)
    WHERE id = p_event_id;
END //
DELIMITER ;
```

#### 3️⃣ `proc_archiver_evenements_passes`
```sql
DELIMITER //
CREATE PROCEDURE proc_archiver_evenements_passes()
BEGIN
    UPDATE evenements 
    SET etat = 'archive'
    WHERE date_evenement < NOW() 
    AND etat != 'archive';
END //
DELIMITER ;
```

### Triggers

#### 1️⃣ Trigger: Mise à jour état complet
```sql
DELIMITER //
CREATE TRIGGER trg_update_event_status_insert
AFTER INSERT ON participations
FOR EACH ROW
BEGIN
    DECLARE v_capacite INT;
    DECLARE v_participants INT;
    
    SELECT capacite_max, nb_participants 
    INTO v_capacite, v_participants
    FROM evenements WHERE id = NEW.id_evenement;
    
    IF v_participants >= v_capacite THEN
        UPDATE evenements 
        SET etat = 'complet'
        WHERE id = NEW.id_evenement;
    END IF;
END //
DELIMITER ;
```

#### 2️⃣ Trigger: Recalcul moyenne évaluations
```sql
DELIMITER //
CREATE TRIGGER trg_update_average_rating
AFTER INSERT ON evaluations
FOR EACH ROW
BEGIN
    UPDATE evenements 
    SET note_moyenne = (
        SELECT AVG(note) FROM evaluations 
        WHERE id_evenement = NEW.id_evenement
    )
    WHERE id = NEW.id_evenement;
END //
DELIMITER ;
```

### Fonctions Utiles

#### 1️⃣ Fonction: Places disponibles
```sql
DELIMITER //
CREATE FUNCTION fct_places_disponibles(p_event_id BIGINT)
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE v_places INT;
    SELECT (capacite_max - nb_participants)
    INTO v_places
    FROM evenements WHERE id = p_event_id;
    RETURN GREATEST(0, v_places);
END //
DELIMITER ;
```

#### Usage
```sql
SELECT fct_places_disponibles(1) AS places_libres;
```

---

## 7️⃣ SÉCURITÉ

### Authentification

#### 1. Laravel Sanctum (Token-Based)
```php
// Middleware 'auth:sanctum' protège les routes
Route::middleware('auth:sanctum')->group(function () {
    // Toutes les routes nécessitent un token valide
});
```

#### 2. Hash des Mots de Passe
```php
// Bcrypt hasage avec Bcrypt rounds = 12
$password = Hash::make($request->password);
```

#### 3. Token API
```
Bearer {token_uuid}
Validité : Liée à la session
Révocation : Déconnexion = suppression du token
```

### Autorisation (RBAC)

#### Rôles
```
┌──────────────────────────────────────┐
│ UTILISATEUR (user)                   │
├──────────────────────────────────────┤
│ ✓ Consulter événements               │
│ ✓ S'inscrire aux événements          │
│ ✓ Annuler inscriptions               │
│ ✓ Évaluer événements                 │
│ ✗ Créer/modifier/supprimer événement │
│ ✗ Voir participants                  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ADMINISTRATEUR (admin)               │
├──────────────────────────────────────┤
│ ✓ Tous les droits utilisateur        │
│ ✓ Créer événements                   │
│ ✓ Modifier événements                │
│ ✓ Supprimer événements               │
│ ✓ Voir participants                  │
│ ✓ Générer statistiques               │
│ ✓ Archiver événements                │
└──────────────────────────────────────┘
```

### Protection des Routes

#### Middleware d'Authentification
```php
// Vérifie le token Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Authentification requise
});

// Admin Only
Route::middleware('admin')->group(function () {
    // Admin uniquement
});
```

### Validation des Données

#### Validation Input
```php
$request->validate([
    'email' => 'required|email|unique:utilisateurs',
    'password' => 'required|min:8|confirmed',
    'note' => 'required|integer|min:1|max:5',
    'commentaire' => 'nullable|string|max:1000',
]);
```

#### Injection SQL Prevention
```php
// Parameterized queries (Eloquent/PDO)
DB::statement('CALL proc_inscrire_utilisateur(?, ?)', [
    $userId,
    $eventId
]);
```

### CORS Configuration

```php
// config/cors.php
'allowed_origins' => ['*'], // Produit: domaines spécifiques
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
'allowed_headers' => ['Content-Type', 'Authorization'],
```

### Bonnes Pratiques Implémentées

| Pratique | Implémentation |
|----------|-----------------|
| **HTTPS** | Obligatoire en production |
| **Token Expiration** | Via Sanctum (sessions) |
| **CORS** | Configuré, origin-based |
| **SQL Injection** | Prepared statements |
| **XSS Prevention** | Échappement JSON |
| **CSRF** | Middleware Laravel intégré |
| **Rate Limiting** | À implémenter selon besoin |
| **Logging** | Fichier log centralisé |
| **Erreurs Génériques** | Messages non spécifiques |

### Données Sensibles

```
🔒 Mots de passe    → Hashés (Bcrypt)
🔒 Tokens           → UUID aléatoire
🔒 Données perso    → RGPD compliant (optionnel)
```

---

## 📈 FLUX COMPLET D'UNE INSCRIPTION

```
1. Utilisateur arrive sur /evenements
   ↓
2. Frontend appelle GET /api/evenements
   ├─ Authentification : Bearer token
   ├─ Réponse : Liste des événements
   ↓
3. Utilisateur clique "S'inscrire"
   ├─ Frontend valide
   ├─ POST /api/participations/inscrire
   ↓
4. Backend vérifie
   ├─ User authentifié ?
   ├─ Événement existe ?
   ├─ Capacité disponible ?
   ├─ Pas déjà inscrit ?
   ↓
5. Procédure stockée : proc_inscrire_utilisateur()
   ├─ INSERT participations
   ├─ UPDATE evenements.nb_participants++
   ├─ TRIGGER : met à jour etat (ouvert → complet)
   ↓
6. Trigger : fct_places_disponibles() recalculée
   ↓
7. Response 201 : "Inscription réussie"
   ↓
8. Frontend met à jour UI
   ├─ Bouton "S'inscrire" → "Inscrit ✓"
   ├─ Affiche "Annuler"
   ├─ Affiche "Noter"
```

---

## 🚀 DÉPLOIEMENT

### HuggingFace Spaces (Docker)

```dockerfile
# Architecture
├─ Frontend React (npm run build → dist/)
├─ Backend Laravel (composer install)
├─ Apache (reverse proxy + static files)
└─ SQLite (persistent volume)
```

### Commande Deployment
```bash
git push -u huggingface main
```

---

## 📞 CONTACT & SUPPORT

- **Platform** : Gestion Evenements 2026
- **Repository** : https://github.com/H-elouakhrouni-dev/gestion_events-
- **Deployed** : https://huggingface.co/spaces/elouakhrouni/gestion_events

---

**Document généré le** : 2026-06-03  
**Version** : 1.0  
**Auteur** : H. Elouakhrouni
