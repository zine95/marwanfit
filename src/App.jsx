import { useState, useRef } from 'react'
import { useStorage, todayKey, weekKey } from './store.js'
import { PROGRAMS, FOODS, RECIPES, SHOPPING_ITEMS, GOALS, INITIAL_PRS } from './data.js'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

// ─── ICONS ────────────────────────────────────────────────────
const Icon = ({ d, size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  dumbbell: 'M6.5 6.5L17.5 17.5M6.5 17.5L17.5 6.5M3 12h2m14 0h2M4 8l2 2m12-2l-2 2M4 16l2-2m12 2l-2-2',
  food: 'M3 11l19-9-9 19-2-8-8-2z',
  chart: 'M18 20V10M12 20V4M6 20v-6',
  book: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 014 17V4.5A2.5 2.5 0 016.5 2H20v17M4 19.5V22',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 110 8 4 4 0 010-8z',
  plus: 'M12 5v14M5 12h14',
  check: 'M20 6L9 17l-5-5',
  fire: 'M12 2c0 0-5 6-5 11a5 5 0 0010 0c0-5-5-11-5-11z',
  target: 'M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z',
  camera: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  arrow_up: 'M12 19V5M5 12l7-7 7 7',
  arrow_down: 'M12 5v14M5 12l7 7 7-7',
  info: 'M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M12 16v-4M12 8h.01',
}

// ─── RING COMPONENT ───────────────────────────────────────────
function Ring({ pct, value, label, sub, color }) {
  const r = 30
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(pct, 1))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={76} height={76} viewBox="0 0 76 76">
        <circle cx={38} cy={38} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <circle
          cx={38} cy={38} r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 38 38)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text x={38} y={42} textAnchor="middle" fill="var(--text)" fontSize={12} fontWeight={600} fontFamily="var(--font-display)">
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', color }}>{value}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{label}</div>
        <div style={{ fontSize: 10, color: 'var(--text3)' }}>{sub}</div>
      </div>
    </div>
  )
}

// ─── PROGRESS BAR ─────────────────────────────────────────────
function ProgBar({ pct, color, height = 4 }) {
  return (
    <div style={{ height, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${Math.min(pct * 100, 100)}%`,
        background: color, borderRadius: 99,
        transition: 'width 0.5s ease'
      }} />
    </div>
  )
}

// ─── CHIP ─────────────────────────────────────────────────────
function Chip({ label, color = 'var(--text2)', bg = 'var(--bg4)' }) {
  return (
    <span style={{
      fontSize: 11, padding: '3px 9px', borderRadius: 99,
      background: bg, color, fontWeight: 500, whiteSpace: 'nowrap'
    }}>{label}</span>
  )
}

// ─── CARD ─────────────────────────────────────────────────────
function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg3)', border: '1px solid var(--border)',
        borderRadius: 'var(--r)', padding: '16px',
        marginBottom: 12, ...(onClick ? { cursor: 'pointer' } : {}), ...style
      }}
    >
      {children}
    </div>
  )
}

// ─── SECTION TITLE ────────────────────────────────────────────
function SecTitle({ children, style = {} }) {
  return (
    <div style={{
      fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase',
      letterSpacing: '1.5px', fontWeight: 600, marginBottom: 10,
      fontFamily: 'var(--font-display)', ...style
    }}>{children}</div>
  )
}

// ─── BTN ──────────────────────────────────────────────────────
function Btn({ children, onClick, style = {}, variant = 'primary' }) {
  const base = {
    padding: '11px 20px', borderRadius: 'var(--r-sm)', fontSize: 14,
    fontWeight: 500, fontFamily: 'var(--font-body)', cursor: 'pointer',
    transition: 'opacity 0.15s', border: 'none', display: 'inline-flex',
    alignItems: 'center', gap: 6
  }
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff' },
    ghost: { background: 'var(--bg4)', color: 'var(--text)', border: '1px solid var(--border)' },
    danger: { background: 'var(--accent4-dim)', color: 'var(--accent4)', border: '1px solid rgba(255,107,138,0.2)' },
  }
  return <button style={{ ...base, ...variants[variant], ...style }} onClick={onClick}>{children}</button>
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ todayLog, setPage, weights, sessionsDone }) {
  const today = todayKey()
  const todayEntry = todayLog[today] || { kcal: 0, p: 0, g: 0, l: 0, items: [] }
  const totalKcal = todayEntry.items?.reduce((s, i) => s + i.kcal, 0) || 0
  const totalP = todayEntry.items?.reduce((s, i) => s + i.p, 0) || 0
  const thisWeek = sessionsDone[weekKey()] || []

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const now = new Date()
  const todayIdx = (now.getDay() + 6) % 7

  const currentWeight = weights.length > 0 ? weights[weights.length - 1].w : GOALS.weight.current
  const weightToLose = currentWeight - GOALS.weight.target

  return (
    <div className="fade-in" style={{ padding: '16px 16px 0' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1230 0%, #0f1628 50%, #0a1a20 100%)',
        border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
        padding: '20px', marginBottom: 16, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 160, height: 160,
          background: 'var(--accent)', opacity: 0.07, borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -20, width: 100, height: 100,
          background: 'var(--accent2)', opacity: 0.06, borderRadius: '50%'
        }} />
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 16 }}>
          Prêt, Marwan? 💪
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
            { val: currentWeight.toFixed(1), lbl: 'kg actuel', color: 'var(--accent)' },
            { val: GOALS.weight.target, lbl: 'kg objectif', color: 'var(--accent2)' },
            { val: weightToLose.toFixed(1), lbl: 'kg à perdre', color: 'var(--accent3)' },
          ].map(s => (
            <div key={s.lbl} style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--r-sm)', padding: '10px 8px'
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak */}
      <SecTitle>Séances cette semaine ({thisWeek.length}/{GOALS.sessions_per_week})</SecTitle>
      <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
        {days.map((d, i) => (
          <div key={d} style={{
            flex: 1, background: thisWeek.includes(i) ? 'var(--accent2-dim)' : 'var(--bg3)',
            border: `1px solid ${i === todayIdx ? 'var(--accent)' : thisWeek.includes(i) ? 'rgba(77,232,176,0.3)' : 'var(--border)'}`,
            borderRadius: 'var(--r-sm)', padding: '7px 3px', textAlign: 'center'
          }}>
            <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 4 }}>{d}</div>
            <div style={{
              width: 7, height: 7, borderRadius: '50%', margin: '0 auto',
              background: thisWeek.includes(i) ? 'var(--accent2)' : i === todayIdx ? 'var(--accent)' : 'var(--text3)'
            }} />
          </div>
        ))}
      </div>

      {/* Rings */}
      <Card style={{ display: 'flex', justifyContent: 'space-around', padding: '16px 8px' }}>
        <Ring pct={totalKcal / GOALS.calories} value={`${Math.round(totalKcal)}`} label="kcal" sub={`/${GOALS.calories}`} color="var(--accent3)" />
        <Ring pct={totalP / GOALS.protein} value={`${Math.round(totalP)}g`} label="protéines" sub={`/${GOALS.protein}g`} color="var(--blue)" />
        <Ring pct={thisWeek.length / GOALS.sessions_per_week} value={`${thisWeek.length}/${GOALS.sessions_per_week}`} label="séances" sub="cette sem." color="var(--accent)" />
      </Card>

      {/* Quick actions */}
      <SecTitle>Actions rapides</SecTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { emoji: '🏋️', title: 'Séance du jour', sub: 'Programme PPL', page: 'workout', color: 'var(--accent)' },
          { emoji: '🍽️', title: 'Nutrition', sub: `${Math.round(totalKcal)} / ${GOALS.calories} kcal`, page: 'nutrition', color: 'var(--accent3)' },
          { emoji: '📈', title: 'Progression', sub: `−${(GOALS.weight.current - currentWeight).toFixed(1)} kg`, page: 'progress', color: 'var(--accent2)' },
          { emoji: '🥗', title: 'Recettes', sub: 'Haute protéine', page: 'recipes', color: 'var(--accent4)' },
        ].map(a => (
          <div key={a.page} onClick={() => setPage(a.page)} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r)',
            padding: 14, cursor: 'pointer', transition: 'border-color 0.15s'
          }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{a.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 2 }}>{a.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{a.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── WORKOUT PAGE ─────────────────────────────────────────────
function WorkoutPage({ sessionSets, setSessionSets, sessionsDone, setSessionsDone }) {
  const [tab, setTab] = useState('push')
  const prog = PROGRAMS[tab]
  const today = todayKey()
  const wk = weekKey()

  function toggleSet(exId, setIdx) {
    const key = `${tab}_${today}`
    const cur = sessionSets[key] || {}
    const exSets = cur[exId] ? [...cur[exId]] : Array(PROGRAMS[tab].exercises.find(e => e.id === exId)?.sets || 4).fill(false)
    exSets[setIdx] = !exSets[setIdx]
    const updated = { ...cur, [exId]: exSets }
    setSessionSets({ ...sessionSets, [key]: updated })

    // mark day done if any set completed
    const allDone = Object.values(updated).some(sets => sets.some(Boolean))
    const todayDayIdx = (new Date().getDay() + 6) % 7
    if (allDone) {
      const wkDays = sessionsDone[wk] || []
      if (!wkDays.includes(todayDayIdx)) {
        setSessionsDone({ ...sessionsDone, [wk]: [...wkDays, todayDayIdx] })
      }
    }
  }

  const key = `${tab}_${today}`
  const curSets = sessionSets[key] || {}

  const totalSets = prog.exercises.reduce((s, e) => s + e.sets, 0)
  const doneSets = Object.values(curSets).reduce((s, sets) => s + sets.filter(Boolean).length, 0)

  return (
    <div className="fade-in" style={{ padding: '16px 16px 0' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--bg2)', padding: 4, borderRadius: 'var(--r-sm)' }}>
        {Object.entries(PROGRAMS).map(([k, p]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 6, border: 'none',
            background: tab === k ? 'var(--bg5)' : 'transparent',
            color: tab === k ? 'var(--text)' : 'var(--text2)',
            fontSize: 13, fontWeight: tab === k ? 600 : 400, cursor: 'pointer',
            fontFamily: 'var(--font-display)', transition: 'all .15s'
          }}>{p.label}</button>
        ))}
      </div>

      {/* Program header */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-display)', color: prog.color }}>{prog.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{prog.days}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: prog.color }}>{doneSets}/{totalSets}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>séries</div>
          </div>
        </div>
        <ProgBar pct={doneSets / totalSets} color={prog.color} height={3} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          {prog.muscles.map(m => (
            <span key={m} style={{
              fontSize: 11, padding: '3px 9px', borderRadius: 99,
              background: 'var(--bg4)', color: 'var(--text2)', border: '1px solid var(--border)'
            }}>{m}</span>
          ))}
        </div>
      </Card>

      {/* Exercises */}
      {prog.exercises.map(ex => {
        const exSets = curSets[ex.id] || Array(ex.sets).fill(false)
        const doneCount = exSets.filter(Boolean).length
        return (
          <Card key={ex.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{ex.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{ex.detail}</div>
              </div>
              <div style={{ fontSize: 12, color: doneCount === ex.sets ? 'var(--accent2)' : 'var(--text3)', marginLeft: 8 }}>
                {doneCount}/{ex.sets}
              </div>
            </div>
            {ex.note && (
              <div style={{
                fontSize: 11, color: 'var(--text3)', background: 'var(--bg4)',
                borderRadius: 6, padding: '5px 9px', marginBottom: 10,
                borderLeft: `2px solid ${prog.color}`
              }}>
                💡 {ex.note}
              </div>
            )}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Array(ex.sets).fill(0).map((_, i) => (
                <div
                  key={i}
                  onClick={() => toggleSet(ex.id, i)}
                  style={{
                    width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: exSets[i] ? 16 : 13, fontWeight: 600,
                    background: exSets[i] ? `${prog.color}22` : 'var(--bg4)',
                    border: `1px solid ${exSets[i] ? prog.color : 'var(--border)'}`,
                    color: exSets[i] ? prog.color : 'var(--text2)',
                    transition: 'all .15s'
                  }}
                >
                  {exSets[i] ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// ─── NUTRITION PAGE ───────────────────────────────────────────
function NutritionPage({ todayLog, setTodayLog, apiKey }) {
  const [search, setSearch] = useState('')
  const [mode, setMode] = useState('search')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const fileRef = useRef()
  const today = todayKey()
  const entry = todayLog[today] || { items: [] }

  const totalKcal = entry.items?.reduce((s, i) => s + i.kcal, 0) || 0
  const totalP = entry.items?.reduce((s, i) => s + i.p, 0) || 0
  const totalG = entry.items?.reduce((s, i) => s + i.g, 0) || 0
  const totalL = entry.items?.reduce((s, i) => s + i.l, 0) || 0

  const results = search.length > 1
    ? FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : []

  function addFood(food, multiplier = 1) {
    const item = {
      id: Date.now(),
      name: food.name,
      kcal: Math.round(food.kcal * multiplier),
      p: Math.round(food.p * multiplier),
      g: Math.round(food.g * multiplier),
      l: Math.round(food.l * multiplier),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
    const updated = { ...todayLog, [today]: { items: [...(entry.items || []), item] } }
    setTodayLog(updated)
    setSearch('')
  }

  function removeItem(id) {
    const updated = { ...todayLog, [today]: { items: entry.items.filter(i => i.id !== id) } }
    setTodayLog(updated)
  }

  async function analyzePhoto(e) {
    const file = e.target.files?.[0]
    if (!file || !apiKey) return
    setAiLoading(true)
    setAiResult(null)
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader()
        r.onload = () => res(r.result.split(',')[1])
        r.onerror = rej
        r.readAsDataURL(file)
      })
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-opus-4-6',
          max_tokens: 400,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
              { type: 'text', text: 'Analyse ce repas. Réponds UNIQUEMENT en JSON strict: {"name":"...","kcal":0,"p":0,"g":0,"l":0}. Valeurs en grammes, kcal en entier.' }
            ]
          }]
        })
      })
      const data = await resp.json()
      const text = data.content?.[0]?.text || '{}'
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      setAiResult(parsed)
    } catch (err) {
      setAiResult({ error: 'Erreur analyse. Vérifie ta clé API.' })
    }
    setAiLoading(false)
  }

  return (
    <div className="fade-in" style={{ padding: '16px 16px 0' }}>
      {/* Calorie bar */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{Math.round(totalKcal)}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>consommé</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{GOALS.calories - Math.round(totalKcal)}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>restant</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text2)' }}>{GOALS.calories}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>objectif</div>
          </div>
        </div>
        <ProgBar pct={totalKcal / GOALS.calories} color="linear-gradient(90deg,var(--accent),var(--accent2))" height={6} />
      </Card>

      {/* Macros */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
        {[
          { val: `${Math.round(totalP)}g`, lbl: 'Protéines', target: GOALS.protein, color: 'var(--blue)' },
          { val: `${Math.round(totalG)}g`, lbl: 'Glucides', target: 300, color: 'var(--accent3)' },
          { val: `${Math.round(totalL)}g`, lbl: 'Lipides', target: 80, color: 'var(--accent2)' },
        ].map(m => (
          <div key={m.lbl} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-display)', color: m.color }}>{m.val}</div>
            <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 6 }}>{m.lbl}</div>
            <ProgBar pct={(parseFloat(m.val) / m.target)} color={m.color} height={3} />
          </div>
        ))}
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[
          { id: 'search', label: '🔍 Recherche' },
          { id: 'photo', label: '📸 Photo IA' },
        ].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            padding: '7px 14px', borderRadius: 99, border: '1px solid var(--border)',
            background: mode === m.id ? 'var(--accent)' : 'var(--bg3)',
            color: mode === m.id ? '#fff' : 'var(--text2)',
            fontSize: 13, cursor: 'pointer', transition: 'all .15s'
          }}>{m.label}</button>
        ))}
      </div>

      {mode === 'search' && (
        <Card>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Chercher un aliment..."
            style={{
              width: '100%', background: 'var(--bg4)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)', padding: '10px 12px', color: 'var(--text)',
              fontSize: 14
            }}
          />
          {results.map(f => (
            <div key={f.id} onClick={() => addFood(f)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer'
            }}>
              <div>
                <div style={{ fontSize: 14 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>{f.p}g prot · {f.g}g gluc · {f.l}g lip</div>
              </div>
              <div style={{ fontSize: 14, color: 'var(--accent3)', fontWeight: 600 }}>+{f.kcal} kcal</div>
            </div>
          ))}
        </Card>
      )}

      {mode === 'photo' && (
        <Card>
          {!apiKey && (
            <div style={{ fontSize: 13, color: 'var(--accent4)', marginBottom: 10, padding: '8px', background: 'var(--accent4-dim)', borderRadius: 8 }}>
              ⚠️ Configure ta clé API Anthropic dans Profil → Paramètres
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={analyzePhoto} />
          <Btn onClick={() => fileRef.current?.click()} style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}>
            📸 Prendre une photo du plat
          </Btn>
          {aiLoading && <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>Analyse en cours...</div>}
          {aiResult && !aiResult.error && (
            <div style={{ background: 'var(--bg4)', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{aiResult.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>
                {aiResult.p}g prot · {aiResult.g}g gluc · {aiResult.l}g lip
              </div>
              <Btn onClick={() => { addFood(aiResult, 1); setAiResult(null) }} style={{ width: '100%', justifyContent: 'center' }}>
                Ajouter {aiResult.kcal} kcal
              </Btn>
            </div>
          )}
          {aiResult?.error && <div style={{ color: 'var(--accent4)', fontSize: 13 }}>{aiResult.error}</div>}
        </Card>
      )}

      {/* Today's log */}
      {entry.items?.length > 0 && (
        <>
          <SecTitle>Repas aujourd'hui</SecTitle>
          <Card>
            {entry.items.map(item => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid var(--border)'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)' }}>{item.time} · {item.p}g prot</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 14, color: 'var(--accent3)', fontWeight: 600 }}>{item.kcal} kcal</div>
                  <button onClick={() => removeItem(item.id)} style={{ color: 'var(--text3)', fontSize: 16, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  )
}

// ─── PROGRESS PAGE ────────────────────────────────────────────
function ProgressPage({ weights, setWeights, prs, setPrs }) {
  const [newWeight, setNewWeight] = useState('')
  const [editPr, setEditPr] = useState(null)
  const [newPrVal, setNewPrVal] = useState('')

  function saveWeight() {
    const w = parseFloat(newWeight)
    if (!w || w < 40 || w > 300) return
    const entry = { date: todayKey(), w, ts: Date.now() }
    setWeights([...weights, entry])
    setNewWeight('')
  }

  const chartData = weights.slice(-12).map(e => ({
    date: e.date.slice(5),
    poids: e.w
  }))

  const currentWeight = weights.length > 0 ? weights[weights.length - 1].w : GOALS.weight.current
  const goalPct = 1 - (currentWeight - GOALS.weight.target) / (GOALS.weight.start - GOALS.weight.target)

  return (
    <div className="fade-in" style={{ padding: '16px 16px 0' }}>
      {/* Weight card */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {currentWeight.toFixed(1)}
              <span style={{ fontSize: 18, color: 'var(--text2)', fontWeight: 400 }}> kg</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--accent4)', marginTop: 4 }}>
              Objectif : {GOALS.weight.target} kg
            </div>
          </div>
          <svg viewBox="0 0 80 80" width={76} height={76}>
            <circle cx={40} cy={40} r={32} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
            <circle cx={40} cy={40} r={32} fill="none" stroke="var(--accent)"
              strokeWidth={6}
              strokeDasharray={201.06}
              strokeDashoffset={201.06 * (1 - Math.min(goalPct, 1))}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
            <text x={40} y={45} textAnchor="middle" fill="var(--text)" fontSize={13} fontWeight={700} fontFamily="var(--font-display)">
              {Math.round(goalPct * 100)}%
            </text>
          </svg>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newWeight}
            onChange={e => setNewWeight(e.target.value)}
            type="number"
            step="0.1"
            placeholder="Ton poids ce matin (kg)"
            style={{
              flex: 1, background: 'var(--bg4)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)', padding: '10px 12px', color: 'var(--text)', fontSize: 15
            }}
          />
          <Btn onClick={saveWeight}>Sauver</Btn>
        </div>
      </Card>

      {/* Chart */}
      {chartData.length > 1 && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 12 }}>Évolution du poids</div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip contentStyle={{ background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
              <Line type="monotone" dataKey="poids" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* PRs */}
      <SecTitle>Records personnels</SecTitle>
      <Card>
        {Object.entries(prs).map(([k, pr]) => (
          <div key={k} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{pr.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>Cible : {pr.target} kg</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {editPr === k ? (
                  <>
                    <input
                      value={newPrVal}
                      onChange={e => setNewPrVal(e.target.value)}
                      type="number"
                      style={{ width: 60, background: 'var(--bg4)', border: '1px solid var(--accent)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 14 }}
                    />
                    <button onClick={() => {
                      const v = parseFloat(newPrVal)
                      if (v > 0) setPrs({ ...prs, [k]: { ...pr, current: v } })
                      setEditPr(null)
                    }} style={{ color: 'var(--accent2)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✓</button>
                  </>
                ) : (
                  <div onClick={() => { setEditPr(k); setNewPrVal(pr.current) }} style={{ cursor: 'pointer' }}>
                    <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{pr.current}</span>
                    <span style={{ fontSize: 13, color: 'var(--text2)' }}> kg</span>
                  </div>
                )}
              </div>
            </div>
            <ProgBar pct={pr.current / pr.target} color="var(--accent)" height={4} />
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4, textAlign: 'right' }}>
              {Math.round(pr.current / pr.target * 100)}% de l'objectif
            </div>
          </div>
        ))}
      </Card>

      {/* Stats */}
      <SecTitle>Résumé</SecTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { val: `−${(GOALS.weight.current - currentWeight).toFixed(1)}`, unit: 'kg', lbl: 'Perdu depuis début', color: 'var(--accent2)' },
          { val: `${(currentWeight - GOALS.weight.target).toFixed(1)}`, unit: 'kg', lbl: 'Reste à perdre', color: 'var(--accent4)' },
          { val: weights.length, unit: 'pesées', lbl: 'Total enregistrées', color: 'var(--accent)' },
          { val: '~9', unit: 'mois', lbl: 'Estimation arrivée', color: 'var(--text2)' },
        ].map(s => (
          <div key={s.lbl} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 14 }}>
            <div>
              <span style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: s.color }}>{s.val}</span>
              <span style={{ fontSize: 14, color: 'var(--text2)' }}> {s.unit}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{s.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── RECIPES PAGE ─────────────────────────────────────────────
function RecipesPage() {
  const [selected, setSelected] = useState(null)
  const [shopping, setShopping] = useStorage('mf_shopping', {})

  function toggleItem(id) {
    setShopping(prev => ({ ...prev, [id]: !prev[id] }))
  }

  if (selected !== null) {
    const r = RECIPES[selected]
    return (
      <div className="fade-in" style={{ padding: '16px 16px 0' }}>
        <button onClick={() => setSelected(null)} style={{
          color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4
        }}>← Retour</button>
        <div style={{ fontSize: 48, marginBottom: 8, textAlign: 'center' }}>{r.emoji}</div>
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 4 }}>{r.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>{r.desc}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          <Chip label={`${r.kcal} kcal`} color="var(--accent3)" bg="var(--accent3-dim)" />
          <Chip label={`${r.p}g protéines`} color="var(--blue)" bg="rgba(96,165,250,0.1)" />
          <Chip label={r.time} />
        </div>
        <SecTitle>Ingrédients</SecTitle>
        <Card style={{ marginBottom: 12 }}>
          {r.ingredients.map((ing, i) => (
            <div key={i} style={{ padding: '7px 0', borderBottom: i < r.ingredients.length - 1 ? '1px solid var(--border)' : 'none', fontSize: 14 }}>
              · {ing}
            </div>
          ))}
        </Card>
        <SecTitle>Préparation</SecTitle>
        <Card>
          {r.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < r.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>{step}</div>
            </div>
          ))}
        </Card>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ padding: '16px 16px 0' }}>
      <SecTitle>Recettes haute protéine</SecTitle>
      {RECIPES.map((r, i) => (
        <Card key={r.id} onClick={() => setSelected(i)} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 36, lineHeight: 1 }}>{r.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 3 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>{r.desc}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Chip label={`${r.p}g prot`} color="var(--blue)" bg="rgba(96,165,250,0.1)" />
                <Chip label={`${r.kcal} kcal`} color="var(--accent3)" bg="var(--accent3-dim)" />
                <Chip label={r.time} />
              </div>
            </div>
          </div>
        </Card>
      ))}

      <SecTitle style={{ marginTop: 8 }}>Liste de courses</SecTitle>
      {Object.entries(SHOPPING_ITEMS).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6, fontWeight: 600 }}>{cat}</div>
          <Card style={{ padding: '8px 14px' }}>
            {items.map(item => (
              <div key={item.id} onClick={() => toggleItem(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0',
                borderBottom: '1px solid var(--border)', cursor: 'pointer'
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: `2px solid ${shopping[item.id] ? 'var(--accent2)' : 'var(--border)'}`,
                  background: shopping[item.id] ? 'var(--accent2-dim)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all .15s'
                }}>
                  {shopping[item.id] && <span style={{ fontSize: 12, color: 'var(--accent2)' }}>✓</span>}
                </div>
                <span style={{ fontSize: 14, flex: 1, color: shopping[item.id] ? 'var(--text3)' : 'var(--text)', textDecoration: shopping[item.id] ? 'line-through' : 'none' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>{item.qty}</span>
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  )
}

// ─── PROFILE PAGE ─────────────────────────────────────────────
function ProfilePage({ apiKey, setApiKey }) {
  const [inputKey, setInputKey] = useState(apiKey || '')
  const [saved, setSaved] = useState(false)

  function save() {
    setApiKey(inputKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="fade-in" style={{ padding: '16px 16px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0 16px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)',
          border: '3px solid var(--bg4)', marginBottom: 10
        }}>M</div>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Marwan</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>Technicien IT · Alternant SETEC · 27 ans</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Franconville 95', 'PPL 4-5×/sem', '1m91', 'Bac+3 IPSSI'].map(t => (
            <span key={t} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)' }}>{t}</span>
          ))}
        </div>
      </div>

      <SecTitle>Objectifs physiques</SecTitle>
      <Card>
        {[
          { label: 'Poids actuel', val: '117 kg' },
          { label: 'Objectif', val: '103 kg', color: 'var(--accent2)' },
          { label: 'Priorité muscu', val: 'Épaules', color: 'var(--accent)' },
          { label: 'Correction posture', val: 'Cyphose', color: 'var(--accent3)' },
        ].map(o => (
          <div key={o.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
            <span style={{ color: 'var(--text2)' }}>{o.label}</span>
            <span style={{ fontWeight: 500, color: o.color || 'var(--text)' }}>{o.val}</span>
          </div>
        ))}
      </Card>

      <SecTitle>Suppléments actifs</SecTitle>
      <Card>
        {[
          { name: 'Oméga-3 (EPA/DHA)', status: 'Actif', color: 'var(--accent2)' },
          { name: 'Magnésium bisglycinate', status: 'Actif', color: 'var(--accent2)' },
          { name: 'Multivitamines', status: 'Actif', color: 'var(--accent2)' },
          { name: 'Créatine monohydrate', status: 'À envisager', color: 'var(--accent3)' },
          { name: 'Vitamine D3/K2', status: 'Recommandé', color: 'var(--accent3)' },
        ].map(s => (
          <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 14 }}>{s.name}</span>
            <Chip label={s.status} color={s.color} bg={`${s.color}22`} />
          </div>
        ))}
      </Card>

      <SecTitle>Paramètres</SecTitle>
      <Card>
        <div style={{ marginBottom: 10, fontSize: 13, color: 'var(--text2)' }}>Clé API Anthropic (photo IA)</div>
        <input
          type="password"
          value={inputKey}
          onChange={e => setInputKey(e.target.value)}
          placeholder="sk-ant-api03-..."
          style={{
            width: '100%', background: 'var(--bg4)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', padding: '10px 12px', color: 'var(--text)',
            fontSize: 14, marginBottom: 8
          }}
        />
        <Btn onClick={save} style={{ width: '100%', justifyContent: 'center' }}>
          {saved ? '✓ Sauvegardé' : 'Sauvegarder la clé'}
        </Btn>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>
          Clé stockée localement sur ton appareil uniquement.
        </div>
      </Card>

      <div style={{ textAlign: 'center', padding: '12px 0 8px', fontSize: 11, color: 'var(--text3)' }}>
        MarwanFit v2.0 · Données stockées localement
      </div>
    </div>
  )
}

// ─── BOTTOM NAV ───────────────────────────────────────────────
function BottomNav({ page, setPage }) {
  const tabs = [
    { id: 'home', icon: ICONS.home, label: 'Accueil' },
    { id: 'workout', icon: ICONS.dumbbell, label: 'Séance' },
    { id: 'nutrition', icon: ICONS.food, label: 'Nutrition' },
    { id: 'progress', icon: ICONS.chart, label: 'Progress' },
    { id: 'recipes', icon: ICONS.book, label: 'Recettes' },
    { id: 'profile', icon: ICONS.user, label: 'Profil' },
  ]
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--bg2)', borderTop: '1px solid var(--border)',
      display: 'flex', paddingBottom: 'var(--safe-bottom)',
      zIndex: 100
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setPage(t.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 3, padding: '8px 4px 10px', background: 'none', border: 'none', cursor: 'pointer'
        }}>
          <Icon d={t.icon} size={20} color={page === t.id ? 'var(--accent)' : 'var(--text3)'} />
          <span style={{ fontSize: 9, color: page === t.id ? 'var(--accent)' : 'var(--text3)', fontWeight: page === t.id ? 600 : 400 }}>
            {t.label}
          </span>
        </button>
      ))}
    </nav>
  )
}

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('home')
  const [todayLog, setTodayLog] = useStorage('mf_food_log', {})
  const [sessionSets, setSessionSets] = useStorage('mf_session_sets', {})
  const [sessionsDone, setSessionsDone] = useStorage('mf_sessions_done', {})
  const [weights, setWeights] = useStorage('mf_weights', [
    { date: '2025-04-01', w: 120, ts: 1 },
    { date: '2025-04-08', w: 119.2, ts: 2 },
    { date: '2025-04-15', w: 118.5, ts: 3 },
    { date: '2025-04-22', w: 118, ts: 4 },
    { date: '2025-04-29', w: 117.3, ts: 5 },
    { date: '2025-05-05', w: 117, ts: 6 },
  ])
  const [prs, setPrs] = useStorage('mf_prs', INITIAL_PRS)
  const [apiKey, setApiKey] = useStorage('mf_api_key', '')

  const pages = {
    home: <HomePage todayLog={todayLog} setPage={setPage} weights={weights} sessionsDone={sessionsDone} />,
    workout: <WorkoutPage sessionSets={sessionSets} setSessionSets={setSessionSets} sessionsDone={sessionsDone} setSessionsDone={setSessionsDone} />,
    nutrition: <NutritionPage todayLog={todayLog} setTodayLog={setTodayLog} apiKey={apiKey} />,
    progress: <ProgressPage weights={weights} setWeights={setWeights} prs={prs} setPrs={setPrs} />,
    recipes: <RecipesPage />,
    profile: <ProfilePage apiKey={apiKey} setApiKey={setApiKey} />,
  }

  return (
    <div style={{
      maxWidth: 480, margin: '0 auto', height: '100%',
      display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--bg)'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
          Marwan<span style={{ color: 'var(--accent)' }}>Fit</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text2)' }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 70 }}>
        {pages[page]}
      </div>

      <BottomNav page={page} setPage={setPage} />
    </div>
  )
}
