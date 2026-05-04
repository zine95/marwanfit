import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Dumbbell, Apple, ChefHat, ShoppingCart, TrendingUp,
  Camera, Trash2, Check, Search, Award, Scale,
  Flame, Beef, ChevronRight, X, ScanLine
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid
} from 'recharts';
import { Html5Qrcode } from 'html5-qrcode';
import { FOOD_DB, WOLF_PROGRAM, GYM_PROGRAM, RECIPES, SHOPPING_LIST } from './data';

// ===========================
// HOOK PERSISTANCE localStorage
// ===========================
function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

// ===========================
// API ANTHROPIC pour analyse photo
// ===========================
async function analyzePhotoWithClaude(base64, mimeType, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
          { type: 'text', text: `Tu es un nutritionniste expert. Analyse cette assiette et estime précisément :
1. Les aliments visibles avec leur quantité estimée en grammes
2. Le mode de cuisson
3. Les macros TOTALES du plat

Réponds UNIQUEMENT en JSON valide sans markdown :
{
  "items": [{"name": "...", "grams": 0}],
  "cooking": "...",
  "total": {"kcal": 0, "p": 0, "c": 0, "l": 0},
  "confidence": "haute|moyenne|basse"
}` }
        ]
      }]
    })
  });
  if (!response.ok) throw new Error('API error: ' + response.status);
  const result = await response.json();
  const text = result.content.filter(c => c.type === 'text').map(c => c.text).join('');
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

// ===========================
// API OPENFOODFACTS pour scan code-barres
// ===========================
async function fetchProductByBarcode(barcode) {
  const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
  const data = await res.json();
  if (data.status !== 1 || !data.product) return null;
  const p = data.product;
  const n = p.nutriments || {};
  return {
    name: p.product_name || p.generic_name || 'Produit inconnu',
    brand: p.brands || '',
    image: p.image_url || p.image_front_url,
    per100g: {
      kcal: n['energy-kcal_100g'] || Math.round((n['energy_100g'] || 0) / 4.184),
      p: n['proteins_100g'] || 0,
      c: n['carbohydrates_100g'] || 0,
      l: n['fat_100g'] || 0,
      fiber: n['fiber_100g'] || 0,
      sugar: n['sugars_100g'] || 0
    },
    nutriscore: p.nutriscore_grade,
    barcode
  };
}

// ===========================
// UI COMPONENTS
// ===========================
function StatCard({ icon: Icon, label, value, sub, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-purple-50 text-purple-700',
    red: 'bg-red-50 text-red-700'
  };
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${colors[color]}`}><Icon className="w-4 h-4" /></div>
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

function MacroBar({ label, current, goal, color }) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-900 font-semibold">{Math.round(current)}/{goal}g</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ===========================
// SCANNER CODE-BARRES
// ===========================
function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const html5QrCode = useRef(null);

  useEffect(() => {
    const id = 'qr-reader';
    html5QrCode.current = new Html5Qrcode(id);

    html5QrCode.current.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 150 } },
      (decoded) => {
        html5QrCode.current.stop().then(() => onScan(decoded));
      },
      () => {}
    ).catch(err => {
      alert('Impossible d\'accéder à la caméra : ' + err.message);
      onClose();
    });

    return () => {
      if (html5QrCode.current?.isScanning) {
        html5QrCode.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="p-4 flex justify-between items-center text-white safe-top">
        <div>
          <h2 className="font-semibold">Scanner code-barres</h2>
          <p className="text-xs text-gray-400">Place le code dans le cadre</p>
        </div>
        <button onClick={() => {
          if (html5QrCode.current?.isScanning) html5QrCode.current.stop().catch(() => {});
          onClose();
        }} className="p-2"><X className="w-6 h-6" /></button>
      </div>
      <div id="qr-reader" ref={scannerRef} className="flex-1" />
    </div>
  );
}

// ===========================
// HOME
// ===========================
function HomeView({ goals, meals, workouts, weight, setView }) {
  const today = new Date().toISOString().split('T')[0];
  const todays = meals.filter(m => m.date === today);
  const macros = todays.reduce((a, m) => ({
    kcal: a.kcal + (m.kcal || 0),
    p: a.p + (m.p || 0),
    c: a.c + (m.c || 0),
    l: a.l + (m.l || 0)
  }), { kcal: 0, p: 0, c: 0, l: 0 });
  const lastWeight = weight[weight.length - 1]?.value || '-';
  const todaysWorkouts = workouts.filter(w => w.date === today).length;

  return (
    <div className="p-4 pb-28 safe-top">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Salut Marwan</p>
        <h1 className="text-2xl font-bold text-gray-900 capitalize">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon={Flame} label="Calories" value={Math.round(macros.kcal)} sub={`/ ${goals.kcal} kcal`} color="orange" />
        <StatCard icon={Scale} label="Poids" value={`${lastWeight}kg`} sub="dernière pesée" color="blue" />
        <StatCard icon={Beef} label="Protéines" value={`${Math.round(macros.p)}g`} sub={`/ ${goals.p}g`} color="red" />
        <StatCard icon={Dumbbell} label="Séances" value={todaysWorkouts} sub="aujourd'hui" color="purple" />
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Apple className="w-4 h-4 text-green-600" /> Macros du jour
        </h3>
        <MacroBar label="Protéines" current={macros.p} goal={goals.p} color="bg-red-500" />
        <MacroBar label="Glucides" current={macros.c} goal={goals.c} color="bg-amber-500" />
        <MacroBar label="Lipides" current={macros.l} goal={goals.l} color="bg-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setView('nutrition')} className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4 text-left active:scale-95 transition">
          <Apple className="w-5 h-5 mb-2" />
          <div className="font-semibold">Ajouter repas</div>
          <div className="text-xs opacity-80">Photo / Scan / Manuel</div>
        </button>
        <button onClick={() => setView('workout')} className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 text-left active:scale-95 transition">
          <Dumbbell className="w-5 h-5 mb-2" />
          <div className="font-semibold">Démarrer séance</div>
          <div className="text-xs opacity-80">Wolf / Salle</div>
        </button>
      </div>
    </div>
  );
}

// ===========================
// NUTRITION (recherche + photo + scan)
// ===========================
function NutritionView({ apiKey, meals, setMeals }) {
  const [mode, setMode] = useState('search'); // search | photo | scan
  const [search, setSearch] = useState('');
  const [grams, setGrams] = useState(100);
  const [selected, setSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [photoResult, setPhotoResult] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const fileRef = useRef(null);
  const today = new Date().toISOString().split('T')[0];
  const todays = meals.filter(m => m.date === today);

  const filtered = Object.entries(FOOD_DB).filter(([n]) =>
    n.toLowerCase().includes(search.toLowerCase())
  );

  function addFromDB() {
    if (!selected) return;
    const f = FOOD_DB[selected];
    const factor = (f.unit === 'g' || f.unit === 'ml') ? grams / 100 : grams;
    setMeals(prev => [...prev, {
      date: today,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      name: selected,
      grams,
      kcal: Math.round(f.kcal * factor),
      p: +(f.p * factor).toFixed(1),
      c: +(f.c * factor).toFixed(1),
      l: +(f.l * factor).toFixed(1)
    }]);
    setSelected(null); setSearch(''); setGrams(100);
  }

  async function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!apiKey) { alert('Configure ta clé API Anthropic dans les Paramètres'); return; }
    setAnalyzing(true); setPhotoResult(null);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const base64 = evt.target.result.split(',')[1];
        const result = await analyzePhotoWithClaude(base64, file.type, apiKey);
        setPhotoResult(result);
      } catch (err) {
        setPhotoResult({ error: 'Erreur analyse: ' + err.message });
      } finally { setAnalyzing(false); }
    };
    reader.readAsDataURL(file);
  }

  function confirmPhoto() {
    if (!photoResult || photoResult.error) return;
    setMeals(prev => [...prev, {
      date: today,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      name: photoResult.items.map(i => `${i.name} (${i.grams}g)`).join(' + '),
      grams: 0,
      kcal: photoResult.total.kcal,
      p: photoResult.total.p,
      c: photoResult.total.c,
      l: photoResult.total.l,
      fromPhoto: true
    }]);
    setPhotoResult(null); setMode('search');
  }

  async function handleScan(barcode) {
    setScannerOpen(false);
    try {
      const product = await fetchProductByBarcode(barcode);
      if (!product) { alert('Produit non trouvé dans OpenFoodFacts'); return; }
      setScannedProduct({ ...product, qty: 100 });
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  }

  function addScanned() {
    if (!scannedProduct) return;
    const factor = scannedProduct.qty / 100;
    setMeals(prev => [...prev, {
      date: today,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      name: `${scannedProduct.name}${scannedProduct.brand ? ` (${scannedProduct.brand})` : ''}`,
      grams: scannedProduct.qty,
      kcal: Math.round(scannedProduct.per100g.kcal * factor),
      p: +(scannedProduct.per100g.p * factor).toFixed(1),
      c: +(scannedProduct.per100g.c * factor).toFixed(1),
      l: +(scannedProduct.per100g.l * factor).toFixed(1),
      fromScan: true
    }]);
    setScannedProduct(null);
  }

  return (
    <div className="p-4 pb-28 safe-top">
      {scannerOpen && <BarcodeScanner onScan={handleScan} onClose={() => setScannerOpen(false)} />}

      <h1 className="text-2xl font-bold mb-1">Nutrition</h1>
      <p className="text-sm text-gray-500 mb-4">Recherche, scan ou photo</p>

      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl">
        {[['search', 'Recherche'], ['photo', '📸 Photo'], ['scan', '⊞ Scan']].map(([k, l]) => (
          <button key={k} onClick={() => setMode(k)} className={`flex-1 py-2 rounded-lg font-medium text-sm ${mode === k ? 'bg-white shadow-sm' : 'text-gray-600'}`}>{l}</button>
        ))}
      </div>

      {mode === 'search' && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          {search && (
            <div className="max-h-48 overflow-y-auto mb-3">
              {filtered.slice(0, 8).map(([n, f]) => (
                <button key={n} onClick={() => setSelected(n)} className={`w-full text-left p-2 rounded-lg text-sm mb-1 ${selected === n ? 'bg-blue-50 text-blue-700' : ''}`}>
                  <div className="font-medium">{n}</div>
                  <div className="text-xs text-gray-500">{f.kcal}k • {f.p}P • {f.c}G • {f.l}L /100{f.unit}</div>
                </button>
              ))}
            </div>
          )}
          {selected && (
            <div className="border-t pt-3">
              <label className="text-xs text-gray-500">Quantité ({FOOD_DB[selected].unit})</label>
              <div className="flex gap-2 items-center mt-1">
                <input type="number" value={grams} onChange={e => setGrams(Number(e.target.value))} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                <button onClick={addFromDB} className="bg-gray-900 text-white px-4 py-2 rounded-xl font-medium text-sm">+ Ajouter</button>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'photo' && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
          {!photoResult && !analyzing && (
            <button onClick={() => fileRef.current?.click()} className="w-full py-12 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center gap-2">
              <Camera className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium">Photo de l'assiette</span>
              <span className="text-xs text-gray-400">Claude va l'analyser</span>
            </button>
          )}
          {analyzing && (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-3"></div>
              <p className="text-sm">Analyse en cours...</p>
            </div>
          )}
          {photoResult && !photoResult.error && (
            <div>
              <h3 className="font-semibold mb-3">Résultat (confiance: {photoResult.confidence})</h3>
              <div className="bg-gray-50 rounded-xl p-3 mb-3 text-sm">
                {photoResult.items.map((it, i) => <div key={i} className="text-gray-600">• {it.name} — {it.grams}g</div>)}
                <div className="text-xs text-gray-500 mt-2">Cuisson: {photoResult.cooking}</div>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs">
                <div className="bg-orange-50 rounded-lg p-2"><div className="font-bold text-orange-700">{photoResult.total.kcal}</div><div className="text-orange-600">kcal</div></div>
                <div className="bg-red-50 rounded-lg p-2"><div className="font-bold text-red-700">{photoResult.total.p}g</div><div className="text-red-600">prot</div></div>
                <div className="bg-amber-50 rounded-lg p-2"><div className="font-bold text-amber-700">{photoResult.total.c}g</div><div className="text-amber-600">gluc</div></div>
                <div className="bg-blue-50 rounded-lg p-2"><div className="font-bold text-blue-700">{photoResult.total.l}g</div><div className="text-blue-600">lip</div></div>
              </div>
              <div className="flex gap-2">
                <button onClick={confirmPhoto} className="flex-1 bg-green-600 text-white py-2 rounded-xl font-medium">✓ Ajouter</button>
                <button onClick={() => setPhotoResult(null)} className="px-4 bg-gray-100 rounded-xl">Annuler</button>
              </div>
            </div>
          )}
          {photoResult?.error && (
            <div className="text-center py-6">
              <p className="text-red-600 mb-3 text-sm">{photoResult.error}</p>
              <button onClick={() => setPhotoResult(null)} className="px-4 py-2 bg-gray-100 rounded-xl">Réessayer</button>
            </div>
          )}
        </div>
      )}

      {mode === 'scan' && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
          {!scannedProduct ? (
            <button onClick={() => setScannerOpen(true)} className="w-full py-12 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center gap-2">
              <ScanLine className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium">Scanner un code-barres</span>
              <span className="text-xs text-gray-400">Base OpenFoodFacts (3M+ produits)</span>
            </button>
          ) : (
            <div>
              {scannedProduct.image && <img src={scannedProduct.image} alt="" className="w-20 h-20 object-cover rounded-xl mx-auto mb-3" />}
              <h3 className="font-semibold text-center mb-1">{scannedProduct.name}</h3>
              {scannedProduct.brand && <p className="text-xs text-gray-500 text-center mb-3">{scannedProduct.brand}</p>}
              <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs">
                <div className="bg-orange-50 rounded-lg p-2"><div className="font-bold text-orange-700">{Math.round(scannedProduct.per100g.kcal)}</div><div className="text-orange-600">kcal</div></div>
                <div className="bg-red-50 rounded-lg p-2"><div className="font-bold text-red-700">{scannedProduct.per100g.p.toFixed(1)}g</div><div className="text-red-600">prot</div></div>
                <div className="bg-amber-50 rounded-lg p-2"><div className="font-bold text-amber-700">{scannedProduct.per100g.c.toFixed(1)}g</div><div className="text-amber-600">gluc</div></div>
                <div className="bg-blue-50 rounded-lg p-2"><div className="font-bold text-blue-700">{scannedProduct.per100g.l.toFixed(1)}g</div><div className="text-blue-600">lip</div></div>
              </div>
              <p className="text-[10px] text-gray-400 text-center mb-3">Valeurs pour 100g</p>
              <label className="text-xs text-gray-500">Quantité (g)</label>
              <div className="flex gap-2 items-center mt-1 mb-3">
                <input type="number" value={scannedProduct.qty} onChange={e => setScannedProduct({ ...scannedProduct, qty: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div className="flex gap-2">
                <button onClick={addScanned} className="flex-1 bg-green-600 text-white py-2 rounded-xl font-medium">✓ Ajouter</button>
                <button onClick={() => setScannedProduct(null)} className="px-4 bg-gray-100 rounded-xl">Annuler</button>
              </div>
            </div>
          )}
        </div>
      )}

      <h2 className="font-semibold mb-3">Repas du jour</h2>
      {todays.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Aucun repas</p>
      ) : todays.map((m, i) => {
        const idx = meals.findIndex(x => x === m);
        return (
          <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 mb-2 flex items-center gap-3">
            <div className="flex-1">
              <div className="text-xs text-gray-400">{m.time} {m.fromPhoto && '📸'}{m.fromScan && '⊞'}</div>
              <div className="font-medium text-sm">{m.name} {m.grams > 0 && `(${m.grams}g)`}</div>
              <div className="text-xs text-gray-500">{m.kcal} kcal • {m.p}P • {m.c}G • {m.l}L</div>
            </div>
            <button onClick={() => setMeals(prev => prev.filter((_, x) => x !== idx))} className="text-gray-300">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ===========================
// SÉANCES
// ===========================
function WorkoutView({ workouts, setWorkouts, prs, setPRs }) {
  const [active, setActive] = useState(null);
  const [logging, setLogging] = useState({});
  const [pr, setPr] = useState({ exo: '', value: '' });

  function start(name, prog) { setActive({ name, ...prog }); setLogging({}); }
  function save() {
    setWorkouts(prev => [...prev, {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      name: active.name, type: active.type, data: logging
    }]);
    setActive(null); setLogging({});
  }

  if (active) {
    return (
      <div className="p-4 pb-28 safe-top">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setActive(null)} className="p-2"><X className="w-5 h-5" /></button>
          <div>
            <h1 className="text-lg font-bold">{active.name}</h1>
            <p className="text-xs text-gray-500">{active.duration || active.type}</p>
          </div>
        </div>

        {active.type === 'wolf' ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">{active.description}</p>
            {active.structure.map(c => (
              <div key={c.circuit} className="bg-white rounded-xl p-4 border border-gray-100 mb-2">
                <div className="font-semibold text-sm mb-2">Circuit {c.circuit}</div>
                {c.exercises.map((e, i) => <div key={i} className="text-sm text-gray-700">• {e}</div>)}
                <input placeholder="Notes" value={logging[`c${c.circuit}`] || ''} onChange={e => setLogging({ ...logging, [`c${c.circuit}`]: e.target.value })} className="w-full mt-2 px-3 py-1 border border-gray-200 rounded-lg text-xs" />
              </div>
            ))}
          </div>
        ) : (
          active.exercises.map((ex, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 mb-2">
              <div className="font-semibold text-sm mb-1">{ex.name}</div>
              <div className="text-xs text-gray-500 mb-2">{ex.sets} × {ex.reps} • Repos {ex.rest}</div>
              <div className="flex gap-2">
                <input type="number" placeholder="Charge (kg)" value={logging[`ex${i}_w`] || ''} onChange={e => setLogging({ ...logging, [`ex${i}_w`]: e.target.value })} className="flex-1 px-2 py-1 border border-gray-200 rounded-lg text-sm" />
                <input placeholder="Reps" value={logging[`ex${i}_r`] || ''} onChange={e => setLogging({ ...logging, [`ex${i}_r`]: e.target.value })} className="flex-1 px-2 py-1 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
          ))
        )}

        <button onClick={save} className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold mt-4">✓ Terminer</button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-28 safe-top">
      <h1 className="text-2xl font-bold mb-1">Sport</h1>
      <p className="text-sm text-gray-500 mb-4">Wolf + Salle</p>

      <h2 className="font-semibold mb-2 text-xs text-gray-600 uppercase tracking-wider">Wolf (maison)</h2>
      {Object.entries(WOLF_PROGRAM).map(([n, p]) => (
        <button key={n} onClick={() => start(n, p)} className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl p-4 mb-2 text-left active:scale-95 transition">
          <div className="font-semibold">{n}</div>
          <div className="text-xs opacity-80">{p.duration} • {p.structure.length} circuits</div>
        </button>
      ))}

      <h2 className="font-semibold mb-2 mt-6 text-xs text-gray-600 uppercase tracking-wider">Salle</h2>
      {Object.entries(GYM_PROGRAM).map(([n, p]) => (
        <button key={n} onClick={() => start(n, p)} className="w-full bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl p-4 mb-2 text-left active:scale-95 transition">
          <div className="font-semibold">{n}</div>
          <div className="text-xs opacity-80">{p.exercises.length} exercices</div>
        </button>
      ))}

      <div className="bg-white rounded-2xl p-4 border border-gray-100 mt-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> Records (PR)</h3>
        <div className="flex gap-2 mb-3">
          <input placeholder="Exo" value={pr.exo} onChange={e => setPr({ ...pr, exo: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <input placeholder="Valeur" value={pr.value} onChange={e => setPr({ ...pr, value: e.target.value })} className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <button onClick={() => {
            if (pr.exo && pr.value) {
              setPRs(prev => [...prev, { ...pr, date: new Date().toISOString().split('T')[0] }]);
              setPr({ exo: '', value: '' });
            }
          }} className="bg-amber-500 text-white px-3 rounded-lg font-medium">+</button>
        </div>
        {prs.slice().reverse().slice(0, 8).map((p, i) => (
          <div key={i} className="flex justify-between py-1.5 text-sm border-b border-gray-50">
            <span className="font-medium">{p.exo}</span>
            <span className="text-amber-700 font-semibold">{p.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 mt-4">
        <h3 className="font-semibold mb-3">Historique</h3>
        {workouts.slice().reverse().slice(0, 5).map((w, i) => (
          <div key={i} className="py-2 border-b border-gray-50 last:border-0">
            <div className="text-xs text-gray-400">{w.date} • {w.time}</div>
            <div className="font-medium text-sm">{w.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================
// RECETTES
// ===========================
function RecipesView() {
  const [open, setOpen] = useState(null);
  if (open) return (
    <div className="p-4 pb-28 safe-top">
      <button onClick={() => setOpen(null)} className="mb-3 text-sm text-gray-600 flex items-center gap-1"><X className="w-4 h-4" /> Retour</button>
      <h1 className="text-xl font-bold mb-1">{open.name}</h1>
      <p className="text-xs text-gray-500 mb-4">{open.duration} • {open.portions} portion(s)</p>
      <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs">
        <div className="bg-orange-50 rounded-lg p-2"><div className="font-bold text-orange-700">{open.macros.kcal}</div><div className="text-orange-600">kcal</div></div>
        <div className="bg-red-50 rounded-lg p-2"><div className="font-bold text-red-700">{open.macros.p}g</div><div className="text-red-600">prot</div></div>
        <div className="bg-amber-50 rounded-lg p-2"><div className="font-bold text-amber-700">{open.macros.c}g</div><div className="text-amber-600">gluc</div></div>
        <div className="bg-blue-50 rounded-lg p-2"><div className="font-bold text-blue-700">{open.macros.l}g</div><div className="text-blue-600">lip</div></div>
      </div>
      <h3 className="font-semibold mb-2">Ingrédients</h3>
      <div className="bg-white rounded-xl p-3 border border-gray-100 mb-4">
        {open.ingredients.map((i, idx) => <div key={idx} className="text-sm py-1 text-gray-700">• {i}</div>)}
      </div>
      <h3 className="font-semibold mb-2">Étapes</h3>
      <div className="space-y-2">
        {open.steps.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 flex gap-3">
            <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">{i + 1}</div>
            <div className="text-sm text-gray-700">{s}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 pb-28 safe-top">
      <h1 className="text-2xl font-bold mb-1">Recettes</h1>
      <p className="text-sm text-gray-500 mb-4">Adaptées à ta diète</p>
      {RECIPES.map(r => (
        <button key={r.id} onClick={() => setOpen(r)} className="w-full bg-white rounded-2xl p-4 border border-gray-100 mb-3 text-left flex items-center gap-3 active:scale-98 transition">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"><ChefHat className="w-6 h-6 text-white" /></div>
          <div className="flex-1">
            <div className="font-semibold text-sm">{r.name}</div>
            <div className="text-xs text-gray-500">{r.duration} • {r.macros.kcal} kcal • {r.macros.p}g prot</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
      ))}
    </div>
  );
}

// ===========================
// COURSES
// ===========================
function ShoppingView({ checked, setChecked }) {
  return (
    <div className="p-4 pb-28 safe-top">
      <h1 className="text-2xl font-bold mb-1">Courses</h1>
      <p className="text-sm text-gray-500 mb-4">Liste générée selon tes recettes</p>
      {Object.entries(SHOPPING_LIST).map(([cat, items]) => (
        <div key={cat} className="mb-5">
          <h2 className="font-semibold text-xs text-gray-600 uppercase tracking-wider mb-2">{cat}</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {items.map((it, i) => {
              const k = `${cat}-${it.name}`;
              const c = checked[k];
              return (
                <button key={i} onClick={() => setChecked(p => ({ ...p, [k]: !p[k] }))} className={`w-full p-3 flex items-center gap-3 border-b border-gray-50 last:border-0 ${c ? 'opacity-40' : ''}`}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${c ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {c && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-medium text-sm ${c ? 'line-through' : ''}`}>{it.name}</div>
                    <div className="text-xs text-gray-400">{it.qty}</div>
                  </div>
                  {it.priority === 'haute' && <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">!</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ===========================
// PROGRESSION
// ===========================
function ProgressView({ weight, setWeight, meals, workouts }) {
  const [w, setW] = useState('');
  const wd = weight.slice(-30).map(x => ({ date: x.date.slice(5), poids: x.value }));
  const calMap = {};
  meals.forEach(m => { calMap[m.date] = (calMap[m.date] || 0) + m.kcal; });
  const last7 = Object.entries(calMap).sort().slice(-7).map(([d, k]) => ({ date: d.slice(5), kcal: k }));

  return (
    <div className="p-4 pb-28 safe-top">
      <h1 className="text-2xl font-bold mb-1">Progression</h1>
      <p className="text-sm text-gray-500 mb-4">Évolution complète</p>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Scale className="w-4 h-4 text-blue-600" /> Poids du jour</h3>
        <div className="flex gap-2 mb-3">
          <input type="number" step="0.1" value={w} onChange={e => setW(e.target.value)} placeholder="kg" className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          <button onClick={() => {
            if (w) {
              const today = new Date().toISOString().split('T')[0];
              setWeight(prev => [...prev.filter(p => p.date !== today), { date: today, value: parseFloat(w) }].sort((a, b) => a.date.localeCompare(b.date)));
              setW('');
            }
          }} className="bg-blue-600 text-white px-4 rounded-xl font-medium">+</button>
        </div>
        {wd.length > 0 && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wd}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip />
                <Line type="monotone" dataKey="poids" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-600" /> Calories - 7 derniers jours</h3>
        {last7.length > 0 ? (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="kcal" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <p className="text-xs text-gray-400">Pas de données</p>}
      </div>

      {weight.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold mb-2">Historique pesées</h3>
          {weight.slice().reverse().slice(0, 10).map((w, i) => (
            <div key={i} className="flex justify-between py-1.5 text-sm border-b border-gray-50">
              <span className="text-gray-500">{w.date}</span>
              <span className="font-semibold">{w.value} kg</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===========================
// SETTINGS (clé API)
// ===========================
function SettingsView({ apiKey, setApiKey, goals, setGoals }) {
  const [k, setK] = useState(apiKey);
  const [g, setG] = useState(goals);
  return (
    <div className="p-4 pb-28 safe-top">
      <h1 className="text-2xl font-bold mb-4">Paramètres</h1>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
        <h3 className="font-semibold mb-2">Clé API Anthropic</h3>
        <p className="text-xs text-gray-500 mb-3">Pour l'analyse photo. Obtiens ta clé sur console.anthropic.com</p>
        <input type="password" value={k} onChange={e => setK(e.target.value)} placeholder="sk-ant-..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-2" />
        <button onClick={() => { setApiKey(k); alert('Clé sauvegardée'); }} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium">Sauvegarder</button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <h3 className="font-semibold mb-3">Objectifs quotidiens</h3>
        {[['kcal', 'Calories'], ['p', 'Protéines (g)'], ['c', 'Glucides (g)'], ['l', 'Lipides (g)']].map(([k, l]) => (
          <div key={k} className="flex items-center gap-2 mb-2">
            <label className="text-sm text-gray-600 w-32">{l}</label>
            <input type="number" value={g[k]} onChange={e => setG({ ...g, [k]: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
        ))}
        <button onClick={() => { setGoals(g); alert('Sauvegardé'); }} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium mt-2">Sauvegarder</button>
      </div>
    </div>
  );
}

// ===========================
// APP
// ===========================
export default function App() {
  const [view, setView] = useState('home');
  const [meals, setMeals] = useLocalState('meals', []);
  const [workouts, setWorkouts] = useLocalState('workouts', []);
  const [weight, setWeight] = useLocalState('weight', []);
  const [prs, setPRs] = useLocalState('prs', []);
  const [shopping, setShopping] = useLocalState('shopping', {});
  const [apiKey, setApiKey] = useLocalState('apiKey', '');
  const [goals, setGoals] = useLocalState('goals', { kcal: 2500, p: 180, c: 250, l: 70 });

  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'workout', label: 'Sport', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutri', icon: Apple },
    { id: 'recipes', label: 'Recettes', icon: ChefHat },
    { id: 'shopping', label: 'Courses', icon: ShoppingCart },
    { id: 'progress', label: 'Progrès', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative">
        {view === 'home' && <HomeView goals={goals} meals={meals} workouts={workouts} weight={weight} setView={setView} />}
        {view === 'workout' && <WorkoutView workouts={workouts} setWorkouts={setWorkouts} prs={prs} setPRs={setPRs} />}
        {view === 'nutrition' && <NutritionView apiKey={apiKey} meals={meals} setMeals={setMeals} />}
        {view === 'recipes' && <RecipesView />}
        {view === 'shopping' && <ShoppingView checked={shopping} setChecked={setShopping} />}
        {view === 'progress' && <ProgressView weight={weight} setWeight={setWeight} meals={meals} workouts={workouts} />}
        {view === 'settings' && <SettingsView apiKey={apiKey} setApiKey={setApiKey} goals={goals} setGoals={setGoals} />}

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 safe-bottom z-40">
          <div className="grid grid-cols-6 gap-1 p-2">
            {tabs.map(t => {
              const I = t.icon;
              return (
                <button key={t.id} onClick={() => setView(t.id)} className={`flex flex-col items-center py-2 rounded-xl transition ${view === t.id ? 'bg-gray-900 text-white' : 'text-gray-400'}`}>
                  <I className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={() => setView('settings')} className="fixed top-3 right-3 z-30 p-2 bg-white border border-gray-200 rounded-full safe-top">
          <span className="text-xs">⚙️</span>
        </button>
      </div>
    </div>
  );
}
