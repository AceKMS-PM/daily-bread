# AGENTS.md — Daily Bread (Pain Quotidien)

> Projet chrétien de dévotions quotidiennes — React + Convex + TailwindCSS

---

## Stack

| Layer | Tech |
|-------|------|
| Runtime | **Bun** |
| Frontend | **React 18** + **TypeScript** |
| Backend/DB | **Convex** (serverless, real-time) |
| Auth | `@convex-dev/auth` (email/password, GitHub, Google) |
| Routing | **React Router v6** |
| Styles | **TailwindCSS** + CSS custom |
| Animations | **Framer Motion** + CSS keyframes |
| Icons | **Lucide React** |
| UI primitives | **Radix** (Avatar, Dialog, DropdownMenu, Select, Tabs, Toast) |
| Utils | clsx, tailwind-merge, date-fns |
| Build | **Vite** |

---

## Architecture

### Routes (src/App.tsx)
- `/` — HomePage (dévotion du jour + verset du jour)
- `/devotional/:date` — Dévotion spécifique par date
- `/archives` — Toutes les dévotions archivées
- `/mur-de-priere` — Mur de prière communautaire
- `/connexion` — Page de connexion/inscription (redirige si déjà auth)
- `/admin` — AdminGuard → AdminLayout
  - `/admin` — Dashboard stats
  - `/admin/devotionals` — Liste des dévotions
  - `/admin/devotionals/new` — Éditeur création
  - `/admin/devotionals/:id/edit` — Éditeur modification
  - `/admin/users` — Gestion membres/rôles
- `*` — NotFoundPage 404

### Convex Schema (convex/schema.ts)
- **users** — userId, email, name, imageUrl, role (admin|member), createdAt, lastSeen
- **devotionals** — title, content (rich text), authorId, bibleBook, bibleChapter, bibleVerseStart/End, bibleText, bibleTranslation, prayer, reflection, tags, coverImage, status (draft|published|scheduled), viewCount, likeCount + scheduledFor ("YYYY-MM-DD"), publishedAt
- **verseOfDay** — date, book, chapter, verseStart/End, text, translation, devotionalId, authorId
- **reactions** — userId, devotionalId, type (amen|heart|fire|pray)
- **prayerRequests** — userId, devotionalId, content, isPublic, isPrayed, prayerCount
- **notifications** — userId, title, message, type (new_devotional|new_verse|prayer_answered|announcement), isRead
- **announcements** — title, content, authorId, isPinned, expiresAt

### Convex Backend Files
- `convex/auth.ts`, `auth.config.ts` — Auth configuration
- `convex/devotionals.ts` — Devotion CRUD queries/mutations
- `convex/users.ts` — User management
- `convex/prayers.ts` — Prayer wall
- `convex/announcements.ts` — Announcements
- `convex/http.ts` — HTTP routes
- `convex/helpers.ts` — Utilities

---

## Design System

### Brand Philosophy
> **Sacred, Devotional, Timeless** — évoque la révérence silencieuse, la profondeur spirituelle, et le poids de la tradition dans un espace numérique moderne.
> Style: **Minimaliste / Sacré-Tactile** — contrastes sombres élevés, grands espaces blancs, accents dorés imitant la feuille d'or des manuscrits classiques. Textures subtiles de parchemin et de pierre.

### Color Palette (tailwind.config.js + globals.css)

**Gold (accent principal)**
- `gold.DEFAULT`: `#C9A84C`
- `gold.light`: `#E8C97A`
- `gold.dark`: `#9B7B2E`

**Sacred (fonds foncés)**
- `sacred.dark`: `#0D0A06`
- `sacred.deeper`: `#1A1308`
- `sacred.warm`: `#2A1F0E`
- `sacred.mid`: `#3D2E18`
- `sacred.accent`: `#4A3520`

**Parchment (textes clairs)**
- `parchment.50`: `#fdfaf4`
- `parchment.100`: `#f9f1e0`
- `parchment.200`: `#f2e0bc`
- `parchment.300`: `#e8c98e`
- `parchment.400`: `#dba85d`
- `parchment.500`: `#c8893a`
- `parchment.600`: `#a86c2a`
- `parchment.700`: `#865222`
- `parchment.800`: `#6b4020`
- `parchment.900`: `#58351d`

**Olive (accent secondaire)**
- `olive.DEFAULT`: `#7C8C5A`
- `olive.light`: `#A4B478`
- `olive.dark`: `#5A6640`

**Crimson (accent warning/danger)**
- `crimson.DEFAULT`: `#8B2020`
- `crimson.light`: `#C44444`
- `crimson.dark`: `#5A1010`

### Typographie
- **Titres (h1-h6)**: `'Cormorant Garamond'`, Georgia, serif (class `font-display`)
- **Corps de texte**: `'EB Garamond'`, Georgia, serif (class `font-serif`)
- **Navigation/boutons**: `'Outfit'`, sans-serif (class `font-sans`)
- **Code**: `'JetBrains Mono'`, monospace (class `font-mono`)

### Gradients
- `gold-gradient`: `linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)`
- `sacred-gradient`: `linear-gradient(180deg, #0D0A06 0%, #1A1308 100%)`
- `parchment-gradient`: `linear-gradient(135deg, #fdfaf4 0%, #f2e0bc 100%)`

### Animations (Tailwind)
- `fade-up`: 0.8s ease — opacité + translateY(30px → 0)
- `fade-in`: 1s ease — opacité 0→1
- `glow-pulse`: 3s — boxShadow gold pulse
- `float`: 6s — translateY oscillant (-10px)
- `shimmer`: 2.5s — backgroundPosition slide

### Box Shadows
- `shadow-gold`: `0 0 30px rgba(201, 168, 76, 0.4)`
- `shadow-gold-sm`: `0 0 15px rgba(201, 168, 76, 0.3)`
- `shadow-sacred`: `0 8px 32px rgba(0, 0, 0, 0.6)`
- `shadow-inner`: `inset 0 2px 8px rgba(0,0,0,0.4)`

### CSS Custom Classes (globals.css)
- `.gold-text` — Texte avec gradient doré + background-clip
- `.gold-border` — Bordure 1px rgba(gold, 0.3)
- `.sacred-card` — Carte fond gradient sacred.deeper → sacred.warm + bordure gold 0.15
- `.sacred-card-hover` — Hover lève la carte + boxShadow + gold border
- `.btn-gold` — Bouton principal gold gradient + uppercase + Outfit
- `.btn-ghost` — Bouton transparent bordure gold
- `.verse-card` — Carte verset avec guillemet décoratif géant
- `.cross-divider` — Séparateur ligne gold centré
- `.noise-overlay` — Texture bruit SVG superposée (opacity 0.03)
- `.nav-link` — Lien navigation uppercase + gold underline hover
- `.field-label` / `.field-input` — Styles formulaires admin dark

### Layout & Spacing
- **Fixed-Width Centered** pour les dévotions (max-width: 720px — comme un livre)
- **12-column fluid grid** pour dashboard et archives
- **Gutter**: 24px entre composants
- **Margins**: 16px mobile / 64px desktop
- **Vertical Rhythm**: 8px incréments standard, 32-48px entre grandes sections
- **Max-width site**: 1280px

### Elevation & Depth
- **Base**: `sacred-dark` (#0D0A06) — plancher du UI
- **Surface**: `sacred-deeper` (#1A1308) — cartes et conteneurs
- **Overlay**: `sacred-warm` (#2A1F0E) — états actifs, modales, dropdowns
- **Glow**: `shadow-gold` (diffused 30px gold bloom) pour cartes "featured"
- **Noise Texture**: overlay SVG global à 0.03 opacité sur toutes les surfaces

### Shapes
- **Standard**: 4px (0.25rem) — boutons, inputs
- **Sacred Cards**: 8px (0.5rem) — cartes distinctes
- **Dividers**: `cross-divider` — ligne gold 1px avec croix/diamant centré

### Composants UI (src/components)
- **layout/** — `Layout.tsx` (public), `AdminLayout.tsx`, `AdminGuard.tsx`
- **devotional/** — Cartes et listes de dévotions
- **prayer/** — Composants mur de prière
- **ui/** — Composants réutilisables (LoadingScreen, etc.)
- **Stitch design references**: les screenshots dans `public/stitch-*.png` montrent le rendu visuel cible

---

## Règles & Conventions

### Auth
- Premier utilisateur inscrit → admin automatiquement
- `@convex-dev/auth` gère sessions + tokens
- AdminGuard check le rôle utilisateur avant d'accéder à `/admin/*`

### Données
- `scheduledFor` stocké en string "YYYY-MM-DD"
- `publishedAt` timestamp unix (null = brouillon)
- Status: `draft` | `scheduled` | `published`
- 7 traductions bibliques: LSG, BDS, NEG, KJV, NIV, ESV, NBS
- Verset du jour peut être lié à une dévotion via `devotionalId`

### Sécurité
- Rate limiting sur endpoints sensibles
- Validation entrées frontend (mot de passe, etc.)
- Routes admin protégées par AdminGuard
- 404 personnalisée

---

## Roadmap & Feature Status

### ✅ Done
- [x] Planification d'articles (scheduled posts) — date picker + status {draft|scheduled|published}
- [x] Mur de prières communautaire — schema, backend (rate-limited), page dédiée, preview accueil
- [x] Sélection traduction biblique (admin) — 7 versions: LSG, BDS, NEG, KJV, NIV, ESV, NBS

### ⚠️ Partial
- [~] Notifications push — schema `notifications` existe, mais pas de queries/mutations ni UI
- [~] Dashboard admin stats — KPIs basiques (comptes), pas de charts ni tendances
- [~] Selecteur traduction publique — admin choisit, mais lecteur ne peut pas switch
- [~] Community Prayers sidebar — section existe en full-width, pas en sidebar latérale

### 🔜 À faire
- [ ] Tags filtering sur archives
- [ ] Barre de navigation mobile (bottom nav)
- [ ] Partage réseaux sociaux
- [ ] Commentaires sur les dévotions
- [ ] Support i18n (FR/EN)
- [ ] Mode clair/sombre toggle
- [ ] Lecteur audio des dévotions
- [ ] Export PDF des dévotions
- [ ] Newsletter email (via Convex cron)
- [ ] Intéractions avec témoignages

## Image Keywords Reference

Mots-clés pour trouver des images libres de droits ou générées par IA, reflétant l'identité visuelle du projet (sacré, médiéval, doré, royal).

### Croix / Symbole
`crucifix medieval gothic`, `byzantine cross gold`, `cross illuminated manuscript stained glass`, `celtic cross ornamented`, `crucifix dark sacred chiaroscuro`, `cross sunrise dramatic`

### Bougie / Lumière
`candle flame gothic dark`, `candleholder gold baroque church`, `votive candle sacred chiaroscuro`, `menorah gold`, `candlelight monastery medieval`, `oil lamp biblical`

### Paysage
`monastery landscape mist dramatic light`, `holy land golden hour oil painting`, `mountains divine light renaissance`, `garden of gethsemane moonlight`, `road to emmaus sunset`, `wilderness biblical desert`, `sea of galilee sunrise`, `valley of the shadow gothic`

### Personnages
`saint medieval painting gothic`, `monk praying manuscript`, `prophet baroque tenebrism`, `angel renaissance gold leaf`, `pilgrim middle ages`, `jesus christ byzantine icon`, `mary magdalene devotional`, `shepherd biblical pastoral`, `king david harp renaissance`, `apostle fishing boat dramatic`

### Animaux
`lion medieval bestiary manuscript`, `lamb religious art renaissance`, `dove holy spirit gold background`, `eagle byzantine icon`, `fish symbol early christian`, `peacock medieval illuminated`, `oxen nativity romanesque`

### Royal / Trône
`crown thorns gold medieval`, `king david renaissance painting`, `magi gold frankincense myrrh`, `throne room gothic cathedral`, `royal purple velvet gold`, `scepter crown jewels medieval`

### Texture / Fond
`gold leaf texture manuscript background`, `parchment old vintage`, `stained glass gothic window`, `altar baroque gold`, `marble pillar roman sacred`, `wood carving gothic church`, `stone wall monastery ancient`

### Divers
`chalice gold holy grail`, `incense smoke church`, `prayer beads rosary`, `open bible old pages`, `scroll torah ancient`, `font baptismal stone`, `organ pipes gothic cathedral`, `bell tower monastery mist`, `ark covenant dramatic`, `manna bread of heaven`

### Style général
`illuminated manuscript`, `gothic religious art`, `byzantine iconography`, `baroque tenebrism religious`, `chiaroscuro spiritual`, `dark academia monastery`, `renaissance devotional art`, `sacred art gold leaf`, `roman fresco christian`, `gothic architecture dramatic light`

### Sources recommandées
- **Unsplash / Pexels / Pixabay** — photos libres de droit
- **Art Institute of Chicago / MET / Rijksmuseum** — peintures religieuses domaine public
- **Midjourney / DALL-E / Stable Diffusion** — prompt suffix: `dark gold sacred medieval manuscript style --ar 16:9`

---

## Notes Dev

- `bun run dev` — Lance frontend (:3000) + Convex sync
- `bunx convex deploy` — Déploie backend Convex
- `bun run build` — Build Vite → `dist/`
- Déploiement frontend: Vercel / Netlify / Cloudflare Pages
- Variables d'env: `.env.local` (local), `.env.production` (prod)
