# 🏋️ MarwanFit - Installation sur iPhone

App de suivi sport, nutrition, photo IA et progression personnalisée.

## 🎯 Ce que fait l'app

- **Sport** : Programme Wolf (maison, 11 circuits) + Salle (Upper/Lower/PPL) avec saisie charge/reps
- **Nutrition** : 3 modes
  - Recherche dans la base d'aliments (60+ aliments)
  - 📸 **Photo IA** : prends une photo de ton plat → Claude analyse les macros
  - ⊞ **Scan code-barres** : OpenFoodFacts (3M+ produits)
- **Recettes** : 4 recettes haute protéine adaptées à ta diète
- **Courses** : Liste générée selon les recettes, cases à cocher
- **Progression** : Graphiques poids/calories/séances + records personnels
- **Persistance complète** : tout sauvegardé localement sur ton iPhone

## 📦 Déploiement en 10 minutes (GRATUIT)

### Étape 1 — Installer Node.js
Si tu n'as pas Node.js : https://nodejs.org → version LTS

### Étape 2 — Tester en local
Ouvre un terminal dans ce dossier et lance :

```bash
npm install
npm run dev
```

L'app sera accessible sur http://localhost:5173

### Étape 3 — Déployer sur Vercel (gratuit, 2 min)

**Option A : Via le site Vercel**
1. Va sur https://vercel.com → Crée un compte (gratuit, login avec GitHub ou email)
2. "Add New" → "Project"
3. Drag & drop le dossier `marwanfit-pwa` (ou push sur GitHub d'abord)
4. Clique "Deploy"
5. Vercel te donne une URL : `https://marwanfit-xxx.vercel.app`

**Option B : Via CLI (plus rapide)**
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Étape 4 — Ajouter à l'écran d'accueil iPhone
1. Ouvre l'URL Vercel dans **Safari** (pas Chrome)
2. Touche le bouton "Partager" (carré avec flèche)
3. Choisis "Sur l'écran d'accueil"
4. ✅ L'icône MarwanFit apparaît, ouvre en plein écran sans barre Safari

### Étape 5 — Configurer ta clé API Anthropic (pour photo IA)
1. Va sur https://console.anthropic.com
2. Crée une clé API (~5$ de crédits gratuits + payant après)
3. Dans MarwanFit : touche ⚙️ en haut à droite → colle ta clé
4. La clé est stockée uniquement sur ton iPhone (pas envoyée ailleurs)

## 🔧 Structure des fichiers

```
marwanfit-pwa/
├── public/
│   ├── icon-192.png        # Icône PWA
│   ├── icon-512.png
│   └── apple-touch-icon.png
├── src/
│   ├── App.jsx             # App principale
│   ├── data.js             # Base aliments + programmes + recettes
│   ├── main.jsx            # Point d'entrée
│   └── index.css           # Styles
├── index.html
├── package.json
├── vite.config.js          # Config PWA
└── tailwind.config.js
```

## 💡 Tips d'usage

- **Scan code-barres** : fonctionne sur tous les produits avec un code-barres EAN/UPC
- **Photo plat** : prends en lumière naturelle pour meilleure précision
- **Sauvegarde** : tes données sont en `localStorage` du navigateur. Pour backup, tu peux exporter via la console Safari : `localStorage` → copier le JSON
- **Pas de connexion** : l'app marche offline (sauf photo IA et scan qui demandent internet)

## 🆘 Problèmes courants

- **Caméra pour scan** : iOS demande l'autorisation, accepte-la
- **Photo IA ne marche pas** : vérifie que ta clé API est bien collée dans Paramètres
- **Données perdues** : si tu vides le cache Safari, les données sont effacées. Faut faire un export/import (à venir)

## 🎯 Prochaines features possibles

- Export/Import des données (sauvegarde cloud iCloud)
- Notifications push (rappels séance / repas)
- HealthKit synchro (si tu passes en Capacitor)
- Plus de recettes
- Chat avec Claude pour coaching en direct

Bonne route ! 💪
