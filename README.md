# Event Management Platform

Full-stack event management system with Laravel backend and React frontend.

## Prerequisites

- PHP 8.2+
- Node.js 18+
- Composer
- MySQL on port 4306 (for local development)

## Setup

1. Install dependencies:
```bash
npm run install:all
```

2. Configure backend database in `backend/.env` (already configured for port 4306)

3. Run migrations:
```bash
cd backend
php artisan migrate
```

## Running the Application

Start both servers:
```bash
npm run dev
```

- **Backend API**: http://127.0.0.1:8000/api
- **Frontend**: http://localhost:5175

## Deployment

### HuggingFace Spaces

Deploy this full-stack application to HuggingFace Spaces using Docker:

```bash
git push -u huggingface main
```

📖 See **[DEPLOYMENT_HUGGINGFACE.md](DEPLOYMENT_HUGGINGFACE.md)** for complete deployment instructions.

---

## 📚 Documentation

### User & Admin Access Flows
- **[USER_FLOWS.md](USER_FLOWS.md)** - Complete user journeys, registration, login, admin dashboard
- **[VISUAL_FLOWS.md](VISUAL_FLOWS.md)** - Visual diagrams and flowcharts
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Step-by-step testing scenarios

### Quick Access

**Regular User**:
- Login: http://localhost:5175/login
- Email: `john@example.com`
- Password: `password`
- Access: Event browsing, registration, ratings

**Admin**:
- Login: http://localhost:5175/login
- Email: `admin@example.com`
- Password: `password`
- Access: Dashboard at http://localhost:5175/dashboard

**New User**:
- Register: http://localhost:5175/register
- Create new account with any email
- Auto-assigned role: `utilisateur`

---

## 🎯 Key Features

### Regular Users
- ✓ Create account with email/password
- ✓ Login securely
- ✓ Browse all events
- ✓ Register for events
- ✓ Cancel registration
- ✓ Rate events (1-5 stars)
- ✓ View my registrations

### Admin Users
- ✓ All user features +
- ✓ Create new events
- ✓ View event participants
- ✓ Cancel events
- ✓ Archive past events
- ✓ Generate statistics

---

## 🏗️ Project Structure

```
backend/        - Laravel API
  ├── app/
  │   ├── Http/Controllers/
  │   │   ├── AuthController.php
  │   │   ├── EvenementController.php
  │   │   ├── ParticipationController.php
  │   │   └── EvaluationController.php
  │   └── Models/
  │       ├── Utilisateur.php
  │       ├── Evenement.php
  │       ├── Participation.php
  │       └── Evaluation.php
  ├── routes/api.php
  └── database/migrations/

frontend/       - React Vite App
  ├── src/
  │   ├── pages/
  │   │   ├── Login.jsx
  │   │   ├── Register.jsx
  │   │   ├── Evenements.jsx (user events)
  │   │   └── Dashboard.jsx (admin panel)
  │   ├── context/AuthContext.jsx
  │   ├── components/
  │   │   ├── ProtectedRoute.jsx
  │   │   └── Navbar.jsx
  │   └── api.js

package.json    - Root scripts (npm run dev, etc)
```

---

## 🔐 Security Features

- ✓ JWT token authentication (Sanctum)
- ✓ Password hashing with bcrypt
- ✓ Protected routes (frontend & backend)
- ✓ Admin-only endpoints
- ✓ Email uniqueness validation
- ✓ CORS protection

---

## 📊 API Endpoints

### Public
- `POST /api/register` - Create account
- `POST /api/login` - Login
- `GET /api/evenements` - List events
- `GET /api/evenements/{id}` - Event details

### Authenticated
- `GET /api/user` - Current user
- `POST /api/logout` - Logout
- `GET /api/me/participations` - My registrations
- `POST /api/participations/inscrire` - Register for event
- `POST /api/participations/annuler` - Cancel registration
- `POST /api/evaluations` - Rate event

### Admin Only
- `POST /api/evenements` - Create event
- `GET /api/evenements/{id}/participants` - View participants
- `POST /api/evenements/archiver` - Archive past events
- `POST /api/evenements/{id}/annuler` - Cancel event
- `POST /api/statistiques` - Generate statistics



## 4. Comptes de test

| Rôle        | Email              | Mot de passe |
|-------------|--------------------|--------------|
| Admin       | admin@example.com  | password     |
| Utilisateur | john@example.com   | password     |

## 5. Lancer les deux en même temps

À la racine du projet :

```powershell
npm run dev
```

## Fonctionnalités (cahier des charges)

| Fonctionnalité | Route / page |
|---------------|----------------|
| Inscription | `/register` — `POST /api/register` |
| Connexion / déconnexion | `/login` — Sanctum |
| Rôles admin / utilisateur | Middleware `admin` |
| Création événements | Dashboard admin |
| Inscription / annulation participation | Page événements |
| Évaluations (1–5 + commentaire) | Modal « Noter » |
| Liste des participants | Dashboard admin (sélecteur d'événement) |

## Livrables académiques

- **Script SQL :** `init_db.sql`, `seed_db.sql`
- **Diagramme UML :** `docs/DIAGRAMME_UML.md` (Mermaid)
- **Présentation :** `docs/PRESENTATION.md` (contenu des slides PPT)

## Sécurité

- Connexion par token **Laravel Sanctum**
- Routes admin protégées (`role = admin`)
- Inscriptions / évaluations liées à l'utilisateur connecté
