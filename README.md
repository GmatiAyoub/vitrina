# Vitrina — Backend (Sprint 0)

API Node.js/Express + Sequelize + PostgreSQL pour la plateforme Vitrina.

## Installation

```bash
npm install
cp .env.example .env
# Renseigner DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET dans .env
```

## Démarrage

```bash
npm run dev          # démarre le serveur en mode watch (nodemon)
npm run seed:admin   # crée l'administrateur par défaut (ADMIN_EMAIL / ADMIN_PASSWORD dans .env)
```

Le serveur synchronise automatiquement les modèles avec la base en développement (`sequelize.sync`).
En production, il faudra passer aux migrations (`sequelize-cli`) plutôt qu'au sync automatique.

## Structure

```
src/
  config/database.js     # config Sequelize par environnement
  models/                 # Utilisateur, Client, Commercant, Administrateur, LogAdmin
  middlewares/auth.js      # authenticate() + authorize(...roles)
  middlewares/validate.js  # gestion des erreurs express-validator
  controllers/authController.js
  routes/authRoutes.js
  app.js / server.js
seeders/seedAdmin.js
```

## Endpoints (Sprint 0)

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | /api/auth/register | public | Inscription (role: client ou commercant) |
| POST | /api/auth/login | public | Connexion, retourne un JWT |
| GET  | /api/auth/me | authentifié | Profil de l'utilisateur connecté |
| GET  | /api/health | public | Health check |

## Checklist de validation — Sprint 0 (GIVEN / WHEN / THEN)

**Inscription**
- GIVEN un email valide, un mot de passe ≥ 8 caractères et un rôle (client/commercant)
  WHEN POST /api/auth/register
  THEN 201, un token JWT est retourné, l'utilisateur est créé actif, un email de confirmation est "envoyé" (log console)

- GIVEN un email déjà utilisé
  WHEN POST /api/auth/register
  THEN 409 "Un compte existe déjà avec cet email."

- GIVEN un mot de passe < 8 caractères ou un rôle invalide
  WHEN POST /api/auth/register
  THEN 400 avec le détail des champs invalides

**Connexion**
- GIVEN des identifiants corrects
  WHEN POST /api/auth/login
  THEN 200 + token JWT

- GIVEN des identifiants incorrects
  WHEN POST /api/auth/login
  THEN 401 "Email ou mot de passe incorrect."

- GIVEN un compte suspendu (active = false)
  WHEN POST /api/auth/login
  THEN 403 "Ce compte a été suspendu..."

**Administrateur**
- GIVEN `npm run seed:admin` exécuté
  WHEN POST /api/auth/login avec ADMIN_EMAIL / ADMIN_PASSWORD
  THEN 200, role = "admin"

## Test rapide avec curl

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"commercant1@test.tn","password":"Passw0rd!","role":"commercant"}'

curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"commercant1@test.tn","password":"Passw0rd!"}'

curl http://localhost:4000/api/auth/me -H "Authorization: Bearer <TOKEN>"
```
