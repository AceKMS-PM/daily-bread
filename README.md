# 🍞 Daily Bread — Pain Quotidien

> **Plateforme chrétienne de dévotions quotidiennes**  
> Pour la gloire de Dieu et l'édification de la communauté

---

## ✝️ Vision

Daily Bread est une plateforme web dédiée à la communauté chrétienne, permettant aux administrateurs de publier des **dévotions quotidiennes** et des **versets bibliques** pour nourrir la foi des membres chaque jour.

---

## 🛠 Stack technique

| Couche | Technologie |
|--------|-------------|
| Runtime | **Bun** |
| Frontend | **React 18** + **TypeScript** |
| Backend/DB | **Convex** (temps réel) |
| Auth | **@convex-dev/auth** |
| Routing | **React Router v6** |
| Styles | **TailwindCSS** |
| Animations | CSS natif |
| Build | **Vite** |

---

## 🚀 Installation & Démarrage

### Prérequis
- [Bun](https://bun.sh) installé
- Compte [Convex](https://convex.dev) (gratuit)

### 1. Cloner et installer

```bash
git clone https://github.com/votre-repo/daily-bread.git
cd daily-bread
bun install
```

### 2. Configurer Convex

```bash
# Se connecter à Convex
bunx convex login

# Initialiser le projet (crée votre backend cloud)
bunx convex dev
```

Convex va vous donner une URL de type `https://xxx.convex.cloud` — copiez-la.

### 3. Variables d'environnement

```bash
cp .env.local.example .env.local
# Remplissez VITE_CONVEX_URL avec votre URL Convex
```

### 4. Lancer en développement

```bash
bun run dev
```

Cela lance simultanément :
- Frontend sur `http://localhost:3000`
- Convex sync en arrière-plan

---

## 🔑 Authentification

L'auth utilise `@convex-dev/auth` avec **email/mot de passe** par défaut.

> 💡 **Le premier utilisateur inscrit devient automatiquement admin.**

Pour activer GitHub/Google OAuth, ajoutez les variables dans le dashboard Convex :
- `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`

---

## 📋 Fonctionnalités

### 👥 Membres (public)
- ✅ Page d'accueil avec la dévotion du jour
- ✅ Verset biblique mis en avant
- ✅ Réactions : Amen 🙏 · Amour ❤️ · Feu 🔥 · Prière ✝️
- ✅ Archives de toutes les dévotions
- ✅ Mur de prière communautaire
- ✅ Navigation par date

### 🛡 Administrateurs
- ✅ Tableau de bord avec statistiques
- ✅ Éditeur de dévotions (verset + corps + réflexion + prière)
- ✅ Sélection parmi 66 livres bibliques
- ✅ 7 traductions supportées (LSG, BDS, NEG, KJV, NIV, ESV, NBS)
- ✅ Système de tags
- ✅ Statuts : Brouillon / Planifié / Publié
- ✅ Gestion des membres et rôles
- ✅ Annonces épinglées

---

## 📁 Structure du projet

```
daily-bread/
├── convex/                 # Backend Convex (serverless)
│   ├── schema.ts           # Structure de la base de données
│   ├── devotionals.ts      # Queries & mutations dévotions
│   ├── users.ts            # Gestion des utilisateurs
│   ├── prayers.ts          # Mur de prière
│   ├── announcements.ts    # Annonces
│   ├── auth.ts             # Configuration auth
│   └── http.ts             # Routes HTTP
│
└── src/                    # Frontend React
    ├── components/
    │   ├── layout/         # Layout, nav, admin sidebar
    │   ├── devotional/     # Cartes de dévotions
    │   ├── prayer/         # Mur de prière
    │   └── ui/             # Composants réutilisables
    ├── pages/
    │   ├── HomePage.tsx     # Accueil + dévotion du jour
    │   ├── DevotionalPage.tsx
    │   ├── ArchivePage.tsx
    │   ├── PrayerWallPage.tsx
    │   ├── SignInPage.tsx
    │   └── admin/          # Interface d'administration
    └── styles/
        └── globals.css     # Styles globaux + variables
```

---

## 🎨 Design

L'interface adopte une esthétique **liturgique dorée** :
- Fond sombre brun-noir évoquant l'encre et le parchemin
- Typographie Cormorant Garamond (titres) + EB Garamond (corps)
- Accent or (#C9A84C) pour les éléments sacrés
- Animations subtiles et lumières douces

---

## 🚢 Déploiement

```bash
# Déployer le backend Convex
bunx convex deploy

# Builder le frontend
bun run build

# Déployer le dossier dist/ sur Vercel / Netlify / Cloudflare Pages
```

---

## 🙏 Sola Dei Gloria

> *« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier »*  
> — Psaumes 119:105
