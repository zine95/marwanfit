// ─── PROGRAMMES ───────────────────────────────────────────────
export const PROGRAMS = {
  push: {
    label: 'Push',
    days: 'Lundi · Jeudi',
    muscles: ['Pectoraux', 'Épaules', 'Triceps'],
    color: '#7c6af7',
    exercises: [
      { id: 'dc', name: 'Développé couché barre', detail: '4×8-10 · Exercice roi pectoraux', sets: 4, note: 'Descente contrôlée, coudes à 45°' },
      { id: 'di', name: 'Développé incliné haltères', detail: '3×10-12 · Faisceau claviculaire', sets: 3, note: 'Inclinaison 30-45°' },
      { id: 'dm', name: 'Développé militaire barre', detail: '4×8-10 · Priorité épaules', sets: 4, note: 'Core gaîné, pas de cambre' },
      { id: 'el', name: 'Élévations latérales', detail: '4×12-15 · Largeur épaules', sets: 4, note: 'Coude légèrement fléchi, montée lente' },
      { id: 'ef', name: 'Élévations frontales', detail: '3×12 · Deltoïde antérieur', sets: 3, note: 'Alterner gauche/droite' },
      { id: 'tr', name: 'Pushdown triceps câble', detail: '4×12-15 · Finition triceps', sets: 4, note: 'Verrouiller les coudes au corps' },
    ]
  },
  pull: {
    label: 'Pull',
    days: 'Mardi · Vendredi',
    muscles: ['Grand dos', 'Trapèzes', 'Biceps', 'Arrière épaules'],
    color: '#4de8b0',
    exercises: [
      { id: 'tv', name: 'Tirage vertical prise large', detail: '4×8-10 · Largeur dos', sets: 4, note: 'Omoplate rétraction, coude dans la poche' },
      { id: 'rb', name: 'Rowing barre', detail: '4×8-10 · Épaisseur dos', sets: 4, note: 'Buste à 45°, tirer vers le nombril' },
      { id: 'ru', name: 'Rowing haltère unilatéral', detail: '3×10-12 · Correction asymétrie', sets: 3, note: 'Amplitude maximale' },
      { id: 'fp', name: 'Face pulls câble', detail: '4×15 · ⚡ Corriger cyphose', sets: 4, note: 'PRIORITÉ : rotation externe, sortir les coudes' },
      { id: 'cb', name: 'Curl biceps barre', detail: '4×10-12 · Masse biceps', sets: 4, note: 'Contrôle total de la descente' },
      { id: 'cm', name: 'Curl marteau haltères', detail: '3×12 · Brachial + avant-bras', sets: 3, note: 'Poignet neutre' },
    ]
  },
  legs: {
    label: 'Legs',
    days: 'Mercredi · Samedi',
    muscles: ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'],
    color: '#ffa04a',
    exercises: [
      { id: 'sq', name: 'Squat barre', detail: '4×8-10 · ⚠️ Douleur genoux', sets: 4, note: 'Amplitude réduite si douleur, essaie stance large' },
      { id: 'pr', name: 'Presse à cuisses', detail: '4×10-12 · Substitut si genoux', sets: 4, note: 'Pieds hauts = ischio/fessiers, pieds bas = quadris' },
      { id: 'rd', name: 'Romanian Deadlift', detail: '3×10-12 · Ischio + fessiers', sets: 3, note: 'Dos plat, pousser les hanches en arrière' },
      { id: 'lc', name: 'Leg curl couché', detail: '3×12-15 · Isolation ischio', sets: 3, note: 'Pas de triche au niveau des hanches' },
      { id: 'mo', name: 'Mollets debout machine', detail: '4×15-20 · Gastrocnémien', sets: 4, note: 'Amplitude complète, étirement en bas' },
    ]
  },
  wolf: {
    label: 'Wolf',
    days: 'Maison · Sans matériel',
    muscles: ['Full body', 'Cardio', 'HIIT'],
    color: '#ff6b8a',
    exercises: [
      { id: 'w1', name: 'Circuit 1 — Activation', detail: 'Jumping jacks + tour de hanches · 5 min', sets: 1, note: 'Monter la fréquence cardiaque progressivement' },
      { id: 'w2', name: 'Circuit 2 — Pompes', detail: '4×15-20 · Repos 45s', sets: 4, note: 'Varier : larges / serrées / inclinées sur chaise' },
      { id: 'w3', name: 'Circuit 3 — Dips chaise', detail: '4×12 · Triceps', sets: 4, note: 'Jambes tendues pour plus de difficulté' },
      { id: 'w4', name: 'Circuit 4 — Traction porte', detail: '3×8-10 · Grand dos', sets: 3, note: 'Barre de traction encadrure de porte' },
      { id: 'w5', name: 'Circuit 5 — Squats', detail: '4×20 · Tempo 3-1-3', sets: 4, note: 'Tempo lent, full amplitude' },
      { id: 'w6', name: 'Circuit 6 — Gainage', detail: '3×45s planche + variantes', sets: 3, note: 'Planche frontale, latérale G/D' },
      { id: 'w7', name: 'Circuit 7 — Burpees', detail: '3×10 · Cardio intensif', sets: 3, note: 'Saut complet en haut' },
      { id: 'w8', name: 'Circuit 8 — Fentes', detail: '3×12 chaque jambe', sets: 3, note: 'Marche avant ou sur place' },
    ]
  }
}

// ─── ALIMENTS ─────────────────────────────────────────────────
export const FOODS = [
  { id: 1, name: 'Pâtes protéinées (100g)', kcal: 352, p: 14, g: 64, l: 3, cat: 'Féculents' },
  { id: 2, name: 'Escalope de poulet (100g)', kcal: 110, p: 23, g: 0, l: 2, cat: 'Viandes' },
  { id: 3, name: 'Œuf entier', kcal: 76, p: 6.3, g: 0.4, l: 5.1, cat: 'Œufs' },
  { id: 4, name: 'Riz blanc cuit (100g)', kcal: 130, p: 2.7, g: 28, l: 0.3, cat: 'Féculents' },
  { id: 5, name: 'Filet de saumon (100g)', kcal: 208, p: 20, g: 0, l: 13, cat: 'Poissons' },
  { id: 6, name: 'Steak haché 5% (100g)', kcal: 121, p: 21, g: 0, l: 4, cat: 'Viandes' },
  { id: 7, name: 'Patate douce (100g)', kcal: 86, p: 1.6, g: 20, l: 0.1, cat: 'Féculents' },
  { id: 8, name: 'Amandes (30g)', kcal: 175, p: 6, g: 6, l: 15, cat: 'Oléagineux' },
  { id: 9, name: 'Yaourt grec 0% (100g)', kcal: 59, p: 10, g: 4, l: 0.4, cat: 'Laitiers' },
  { id: 10, name: 'Fromage blanc 0% (100g)', kcal: 45, p: 8, g: 3, l: 0.2, cat: 'Laitiers' },
  { id: 11, name: 'Banane (1 moyenne)', kcal: 89, p: 1.1, g: 23, l: 0.3, cat: 'Fruits' },
  { id: 12, name: 'Pain complet (1 tranche)', kcal: 80, p: 4, g: 15, l: 1, cat: 'Féculents' },
  { id: 13, name: 'Thon en conserve (100g)', kcal: 116, p: 26, g: 0, l: 1, cat: 'Poissons' },
  { id: 14, name: 'Blanc de dinde (100g)', kcal: 104, p: 22, g: 0, l: 1.6, cat: 'Viandes' },
  { id: 15, name: 'Flocons d\'avoine (50g)', kcal: 189, p: 6.5, g: 32, l: 3.5, cat: 'Féculents' },
  { id: 16, name: 'Lentilles cuites (100g)', kcal: 116, p: 9, g: 20, l: 0.4, cat: 'Légumineuses' },
  { id: 17, name: 'Noix de cajou (30g)', kcal: 168, p: 4.5, g: 9, l: 13, cat: 'Oléagineux' },
  { id: 18, name: 'Whey protéine (30g)', kcal: 118, p: 24, g: 3, l: 1.5, cat: 'Suppléments' },
  { id: 19, name: 'Crevettes cuites (100g)', kcal: 99, p: 21, g: 0, l: 1.5, cat: 'Poissons' },
  { id: 20, name: 'Brocoli cuit (100g)', kcal: 28, p: 2.8, g: 4, l: 0.4, cat: 'Légumes' },
  { id: 21, name: 'Épinards (100g)', kcal: 23, p: 2.9, g: 3.6, l: 0.4, cat: 'Légumes' },
  { id: 22, name: 'Huile d\'olive (10ml)', kcal: 90, p: 0, g: 0, l: 10, cat: 'Matières grasses' },
  { id: 23, name: 'Mozzarella (30g)', kcal: 73, p: 5.5, g: 0.5, l: 5.5, cat: 'Laitiers' },
  { id: 24, name: 'Quinoa cuit (100g)', kcal: 120, p: 4.4, g: 21, l: 1.9, cat: 'Féculents' },
  { id: 25, name: 'Pomme de terre cuite (100g)', kcal: 77, p: 2, g: 17, l: 0.1, cat: 'Féculents' },
]

// ─── RECETTES ─────────────────────────────────────────────────
export const RECIPES = [
  {
    id: 1,
    emoji: '🍗',
    name: 'Bol pâtes protéinées au poulet',
    desc: 'Ton repas principal — rapide, efficace, validé.',
    time: '10 min',
    kcal: 1452,
    p: 142,
    g: 230,
    l: 14,
    ingredients: [
      '350g pâtes protéinées (sec)',
      '200g escalope de poulet',
      'Sel, herbes de Provence',
      '10ml huile d\'olive',
    ],
    steps: [
      'Cuire les pâtes al dente (8-9 min eau bouillante salée)',
      'Cuire l\'escalope à la poêle avec un filet d\'huile, sel, herbes',
      'Trancher le poulet, mélanger avec les pâtes égouttées',
      'Optionnel : ajouter du parmesan ou du fromage blanc 0%',
    ]
  },
  {
    id: 2,
    emoji: '🥚',
    name: 'Omelette 5 œufs épinards-feta',
    desc: 'Repas du soir rapide, riche en protéines et micronutriments.',
    time: '7 min',
    kcal: 420,
    p: 38,
    g: 4,
    l: 27,
    ingredients: [
      '5 œufs entiers',
      '80g épinards frais',
      '30g feta',
      'Sel, poivre, piment doux',
    ],
    steps: [
      'Battre les œufs en omelette avec sel/poivre',
      'Poêle chaude avec spray huile de coco',
      'Verser les œufs, ajouter les épinards et la feta',
      'Refermer l\'omelette, cuire 2-3 min à feu moyen',
    ]
  },
  {
    id: 3,
    emoji: '🐟',
    name: 'Saumon riz + légumes grillés',
    desc: 'Repas équilibré riche en Oméga-3, parfait post-séance.',
    time: '20 min',
    kcal: 630,
    p: 52,
    g: 58,
    l: 18,
    ingredients: [
      '200g filet de saumon',
      '150g riz blanc (sec)',
      '100g brocoli',
      'Citron, ail, persil',
    ],
    steps: [
      'Cuire le riz (15 min eau bouillante)',
      'Cuire le brocoli vapeur 5 min',
      'Poêler le saumon 3-4 min / face avec ail',
      'Dresser avec jus de citron et persil frais',
    ]
  },
  {
    id: 4,
    emoji: '🥩',
    name: 'Steak haché patate douce',
    desc: 'Charge glucidique post-séance avec protéine de qualité.',
    time: '20 min',
    kcal: 590,
    p: 47,
    g: 62,
    l: 14,
    ingredients: [
      '200g steak haché 5%',
      '300g patate douce',
      'Cumin, paprika, sel',
      'Yaourt grec 0%',
    ],
    steps: [
      'Cuire les patates douces en cubes 15 min four 200°',
      'Façonner le steak avec cumin et paprika',
      'Cuire le steak 3 min/face à feu vif',
      'Servir avec une cuillère de yaourt grec',
    ]
  },
  {
    id: 5,
    emoji: '🥗',
    name: 'Bowl thon avocat quinoa',
    desc: 'Repas froid préparable à l\'avance, top en semaine.',
    time: '10 min',
    kcal: 510,
    p: 42,
    g: 48,
    l: 15,
    ingredients: [
      '160g thon en conserve (égoutté)',
      '100g quinoa cuit',
      '½ avocat',
      'Citron, sauce soja, coriandre',
    ],
    steps: [
      'Cuire le quinoa en avance (préparation batch)',
      'Émietter le thon, couper l\'avocat en dés',
      'Mélanger avec le quinoa refroidi',
      'Assaisonner citron + sauce soja + coriandre',
    ]
  },
]

// ─── LISTE DE COURSES ──────────────────────────────────────────
export const SHOPPING_ITEMS = {
  'Protéines animales': [
    { id: 's1', name: 'Escalopes de poulet', qty: '1.5 kg' },
    { id: 's2', name: 'Œufs (plein air)', qty: '×18' },
    { id: 's3', name: 'Steak haché 5%', qty: '500g' },
    { id: 's4', name: 'Filet de saumon', qty: '400g' },
    { id: 's5', name: 'Thon en conserve', qty: '×4 boîtes' },
    { id: 's6', name: 'Blanc de dinde', qty: '300g' },
  ],
  'Féculents & céréales': [
    { id: 's7', name: 'Pâtes protéinées Barilla+', qty: '1 kg' },
    { id: 's8', name: 'Riz blanc', qty: '1 kg' },
    { id: 's9', name: 'Patates douces', qty: '1.5 kg' },
    { id: 's10', name: 'Flocons d\'avoine', qty: '500g' },
    { id: 's11', name: 'Quinoa', qty: '500g' },
  ],
  'Laitiers & œufs': [
    { id: 's12', name: 'Yaourt grec 0%', qty: '×8 pots' },
    { id: 's13', name: 'Fromage blanc 0%', qty: '500g' },
  ],
  'Légumes & fruits': [
    { id: 's14', name: 'Épinards frais', qty: '300g' },
    { id: 's15', name: 'Brocoli', qty: '500g' },
    { id: 's16', name: 'Bananes', qty: '×6' },
    { id: 's17', name: 'Citrons', qty: '×4' },
  ],
  'Suppléments': [
    { id: 's18', name: 'Oméga-3 (EPA/DHA)', qty: 'Restock si < 30j' },
    { id: 's19', name: 'Magnésium bisglycinate', qty: 'Restock si < 30j' },
    { id: 's20', name: 'Multivitamines', qty: 'Restock si < 30j' },
    { id: 's21', name: 'Créatine monohydrate', qty: '500g (à envisager)' },
  ],
}

// ─── OBJECTIFS ────────────────────────────────────────────────
export const GOALS = {
  weight: { current: 117, target: 103, start: 120 },
  calories: 2500,
  protein: 200,
  sessions_per_week: 5,
}

// ─── PRs ──────────────────────────────────────────────────────
export const INITIAL_PRS = {
  squat: { current: 60, target: 100, label: 'Squat barre' },
  bench: { current: 80, target: 120, label: 'Développé couché' },
  rdl: { current: 90, target: 160, label: 'Soulevé de terre' },
  ohp: { current: 50, target: 80, label: 'Développé militaire' },
  row: { current: 70, target: 120, label: 'Rowing barre' },
}
