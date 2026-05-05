export const AVATAR_COLORS = [
  { id: 'fire',    bg: '#ff4d1a', label: 'Feu' },
  { id: 'ice',     bg: '#1ad4ff', label: 'Glace' },
  { id: 'thunder', bg: '#f7c948', label: 'Foudre' },
  { id: 'forest',  bg: '#3ddc84', label: 'Forêt' },
  { id: 'violet',  bg: '#a855f7', label: 'Violet' },
  { id: 'rose',    bg: '#ff6b8a', label: 'Rose' },
]

export const PROGRAMS = {
  push: {
    label: 'Push', days: 'Lundi · Jeudi',
    muscles: ['Pectoraux', 'Épaules', 'Triceps'],
    exercises: [
      { id: 'dc', name: 'Développé couché barre', detail: '4×8-10', sets: 4, note: 'Descente contrôlée, coudes à 45°' },
      { id: 'di', name: 'Développé incliné haltères', detail: '3×10-12', sets: 3, note: 'Inclinaison 30-45°' },
      { id: 'dm', name: 'Développé militaire barre', detail: '4×8-10', sets: 4, note: 'Core gaîné, pas de cambre' },
      { id: 'el', name: 'Élévations latérales', detail: '4×12-15', sets: 4, note: 'Coude légèrement fléchi' },
      { id: 'ef', name: 'Élévations frontales', detail: '3×12', sets: 3, note: 'Alterner gauche/droite' },
      { id: 'tr', name: 'Pushdown triceps câble', detail: '4×12-15', sets: 4, note: 'Coudes verrouillés au corps' },
    ]
  },
  pull: {
    label: 'Pull', days: 'Mardi · Vendredi',
    muscles: ['Grand dos', 'Trapèzes', 'Biceps'],
    exercises: [
      { id: 'tv', name: 'Tirage vertical prise large', detail: '4×8-10', sets: 4, note: 'Omoplate en rétraction' },
      { id: 'rb', name: 'Rowing barre', detail: '4×8-10', sets: 4, note: 'Tirer vers le nombril' },
      { id: 'ru', name: 'Rowing haltère unilatéral', detail: '3×10-12', sets: 3, note: 'Amplitude maximale' },
      { id: 'fp', name: 'Face pulls câble', detail: '4×15', sets: 4, note: '⚡ Corriger la cyphose — priorité' },
      { id: 'cb', name: 'Curl biceps barre', detail: '4×10-12', sets: 4, note: 'Contrôle total de la descente' },
      { id: 'cm', name: 'Curl marteau haltères', detail: '3×12', sets: 3, note: 'Poignet neutre' },
    ]
  },
  legs: {
    label: 'Legs', days: 'Mercredi · Samedi',
    muscles: ['Quadriceps', 'Ischio', 'Fessiers', 'Mollets'],
    exercises: [
      { id: 'sq', name: 'Squat barre', detail: '4×8-10', sets: 4, note: '⚠️ Amplitude réduite si douleur genoux' },
      { id: 'pr', name: 'Presse à cuisses', detail: '4×10-12', sets: 4, note: 'Substitut squat si douleur' },
      { id: 'rd', name: 'Romanian Deadlift', detail: '3×10-12', sets: 3, note: 'Dos plat, hanches en arrière' },
      { id: 'lc', name: 'Leg curl couché', detail: '3×12-15', sets: 3, note: 'Pas de triche au niveau des hanches' },
      { id: 'mo', name: 'Mollets debout machine', detail: '4×15-20', sets: 4, note: 'Amplitude complète' },
    ]
  },
  full: {
    label: 'Full Body', days: 'Tous niveaux',
    muscles: ['Full body', 'Force', 'Cardio'],
    exercises: [
      { id: 'f1', name: 'Squat / Goblet squat', detail: '4×12', sets: 4, note: 'Avec ou sans charge' },
      { id: 'f2', name: 'Développé couché / Pompes', detail: '4×12', sets: 4, note: 'Adapter à ta force' },
      { id: 'f3', name: 'Tirage / Rowing haltère', detail: '4×12', sets: 4, note: 'Dos droit' },
      { id: 'f4', name: 'Fentes alternées', detail: '3×10 / jambe', sets: 3, note: 'Contrôle du genou' },
      { id: 'f5', name: 'Gainage planche', detail: '3×45s', sets: 3, note: 'Respiration régulière' },
      { id: 'f6', name: 'Burpees / Sauts', detail: '3×10', sets: 3, note: 'Cardio final' },
    ]
  }
}

export const FOODS = [
  { id: 1,  name: 'Pâtes protéinées (100g)', kcal: 352, p: 14, g: 64, l: 3 },
  { id: 2,  name: 'Escalope poulet (100g)', kcal: 110, p: 23, g: 0,  l: 2 },
  { id: 3,  name: 'Œuf entier', kcal: 76,  p: 6.3, g: 0.4, l: 5.1 },
  { id: 4,  name: 'Riz blanc cuit (100g)', kcal: 130, p: 2.7, g: 28, l: 0.3 },
  { id: 5,  name: 'Filet de saumon (100g)', kcal: 208, p: 20, g: 0,  l: 13 },
  { id: 6,  name: 'Steak haché 5% (100g)', kcal: 121, p: 21, g: 0,  l: 4 },
  { id: 7,  name: 'Patate douce (100g)', kcal: 86,  p: 1.6, g: 20, l: 0.1 },
  { id: 8,  name: 'Amandes (30g)', kcal: 175, p: 6,   g: 6,  l: 15 },
  { id: 9,  name: 'Yaourt grec 0% (100g)', kcal: 59,  p: 10,  g: 4,  l: 0.4 },
  { id: 10, name: 'Fromage blanc 0% (100g)', kcal: 45,  p: 8,   g: 3,  l: 0.2 },
  { id: 11, name: 'Banane (1 moyenne)', kcal: 89,  p: 1.1, g: 23, l: 0.3 },
  { id: 12, name: 'Thon en conserve (100g)', kcal: 116, p: 26,  g: 0,  l: 1 },
  { id: 13, name: 'Blanc de dinde (100g)', kcal: 104, p: 22,  g: 0,  l: 1.6 },
  { id: 14, name: 'Flocons d\'avoine (50g)', kcal: 189, p: 6.5, g: 32, l: 3.5 },
  { id: 15, name: 'Whey protéine (30g)', kcal: 118, p: 24,  g: 3,  l: 1.5 },
  { id: 16, name: 'Lentilles cuites (100g)', kcal: 116, p: 9,   g: 20, l: 0.4 },
  { id: 17, name: 'Crevettes cuites (100g)', kcal: 99,  p: 21,  g: 0,  l: 1.5 },
  { id: 18, name: 'Brocoli cuit (100g)', kcal: 28,  p: 2.8, g: 4,  l: 0.4 },
  { id: 19, name: 'Pain complet (1 tranche)', kcal: 80,  p: 4,   g: 15, l: 1 },
  { id: 20, name: 'Quinoa cuit (100g)', kcal: 120, p: 4.4, g: 21, l: 1.9 },
]

export const RECIPES = [
  { id:1, emoji:'🍗', name:'Bol pâtes protéinées poulet', kcal:1452, p:142, time:'10 min',
    ingredients:['350g pâtes protéinées','200g escalope poulet','Huile olive, herbes'],
    steps:['Cuire pâtes al dente 8-9 min','Cuire escalope à la poêle','Mélanger, assaisonner'] },
  { id:2, emoji:'🥚', name:'Omelette 5 œufs épinards', kcal:420, p:38, time:'7 min',
    ingredients:['5 œufs','80g épinards','30g feta','Sel, poivre'],
    steps:['Battre les œufs','Poêle chaude, verser','Ajouter épinards + feta, refermer'] },
  { id:3, emoji:'🐟', name:'Saumon riz légumes grillés', kcal:630, p:52, time:'20 min',
    ingredients:['200g saumon','150g riz','100g brocoli','Citron, ail'],
    steps:['Cuire riz 15 min','Brocoli vapeur 5 min','Poêler saumon 3-4 min/face'] },
  { id:4, emoji:'🥩', name:'Steak haché patate douce', kcal:590, p:47, time:'20 min',
    ingredients:['200g steak haché 5%','300g patate douce','Cumin, paprika'],
    steps:['Patates douces au four 15 min 200°','Steak avec épices 3 min/face','Servir avec yaourt grec'] },
  { id:5, emoji:'🥗', name:'Bowl thon quinoa avocat', kcal:510, p:42, time:'10 min',
    ingredients:['160g thon conserve','100g quinoa','½ avocat','Sauce soja, citron'],
    steps:['Cuire quinoa à l\'avance','Émietter thon, couper avocat','Mélanger, assaisonner'] },
]

export const SHOPPING = {
  'Protéines': [
    { id:'s1', name:'Escalopes de poulet', qty:'1.5 kg' },
    { id:'s2', name:'Œufs (plein air)', qty:'×18' },
    { id:'s3', name:'Steak haché 5%', qty:'500g' },
    { id:'s4', name:'Filet de saumon', qty:'400g' },
    { id:'s5', name:'Thon en conserve', qty:'×4' },
  ],
  'Féculents': [
    { id:'s6', name:'Pâtes protéinées', qty:'1 kg' },
    { id:'s7', name:'Riz blanc', qty:'1 kg' },
    { id:'s8', name:'Patates douces', qty:'1.5 kg' },
    { id:'s9', name:'Flocons d\'avoine', qty:'500g' },
  ],
  'Légumes & fruits': [
    { id:'s10', name:'Épinards frais', qty:'300g' },
    { id:'s11', name:'Brocoli', qty:'500g' },
    { id:'s12', name:'Bananes', qty:'×6' },
  ],
  'Suppléments': [
    { id:'s13', name:'Oméga-3', qty:'Restock' },
    { id:'s14', name:'Magnésium bisglycinate', qty:'Restock' },
    { id:'s15', name:'Multivitamines', qty:'Restock' },
  ],
}
