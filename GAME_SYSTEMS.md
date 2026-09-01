# GAME_SYSTEMS — One Chicago RP (FR)

Ce fichier centralise le déroulé des phases et l'état d'avancement pour le projet One Chicago RP — branche active : `phase-2/characters`.

Résumé des phases (2→12) — plan global

- Phase 2 — Characters (EN COURS)
  - Créateur de personnage complet (FR)
  - Backend : endpoints GET /api/careers, GET /api/careers/:id, POST/GET/PUT /api/characters
  - Validation Zod (messages FR)
  - Règles d'âge (career.minAge)
  - Frontend : page « Création de personnage » mobile-first, curseur d'âge, validations FR
  - Seed : carrières, spécialisations, PNJ de démonstration
  - Tests : unitaires + supertest + e2e minimal

- Phase 3 — Scenes
  - Système de scènes RP (création, journal, mémoire), endpoints /api/scenes
  - Frontend : liste, éditeur, vue de lecture
  - Tests e2e : créer scène → ajouter événement → charger scène

- Phase 4 — Map & Events
  - Carte interactive, affichage d'événements, génération procédurale minimale
  - Intégration OSM/Leaflet (si besoin) ou mock carte pour MVP

- Phase 5 — Services (Police / Pompiers / Médical)
  - Modèles métier, endpoints dédiés, UI pour interventions et statut

- Phase 6 — Investigations
  - Rapports, preuves, fiches d'enquête, échanges entre services

- Phase 7 — Economy
  - Économie simple : banque, comptes, véhicules, achat/vente immobilier

- Phase 8 — Social & Education
  - Écoles, services sociaux, animaux, statuts sociaux

- Phase 9 — Justice
  - Procédures judiciaires simplifiées, prison, sanctions, médecine légale

- Phase 10 — Special Features
  - Unités spécialisées (cyber, plongeurs, négociateurs), événements avancés

- Phase 11 — Optimisation & Sécurité
  - Tests de charge, optimisation front/back, hardening sécurité

- Phase 12 — Documentation & Déploiement
  - README complet, manifests Docker, guides de déploiement, poss. Terraform

Décision prises (par défaut) — confirmées par vous

- PRs : j'ouvre par défaut des PR vers `phase-1/scaffold` pour relecture.
- Dépôt : restera public (à moins que vous demandiez privé).
- CI : n'exécutera PAS automatiquement les migrations & le seed sans vos secrets.
- Temps réel : implémentation initiale par polling; WebSocket possible sur demande.

Actions immédiates que je vais réaliser maintenant

1. Terminer Phase 2 :
   - terminer la page frontend « Création de personnage » (FR) et l'intégrer à /api/careers
   - enrichir le seed (carrières, spécialisations, PNJ)
   - ajouter tests backend (unitaires/supertest) et e2e minimale
   - ouvrir PR `phase-2/characters` → `phase-1/scaffold`

2. Poursuivre automatiquement les phases 3→12 par itérations :
   - branche dédiée par phase, commits atomiques, tests, PR avec checklist

Checklist pour tester localement (rappel)

- git clone https://github.com/aurelionstudio01-jpg/one-chicago-rp-fr
- git checkout phase-2/characters
- cp .env.example .env (remplir DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET si nécessaire)
- docker-compose up -d
- cd backend
  - pnpm install
  - npx prisma generate
  - npx prisma migrate dev --name characters
  - pnpm run seed
  - pnpm dev
- cd ../frontend
  - pnpm install
  - pnpm dev

Notes sécurité

- Changez immédiatement les mots de passe seedés avant tout déploiement public.
- Ne mettez aucune clé API dans le frontend.

Contact & reporting

- Je pousserai des commits atomiques et ouvrirai les PRs phase par phase.
- Je fournirai un rapport après chaque PR (liste de fichiers ajoutés/modifiés, instructions pour tester localement, checks passés).

Si vous souhaitez changer une décision (PR→main, repo privé, CI auto ou WebSocket), répondez ici et j'ajusterai le plan immédiatement.
