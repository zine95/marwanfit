import { useState, useRef, useCallback } from 'react'
import { useStorage, todayKey, weekKey, hashPin } from './store.js'
import { AVATAR_COLORS, PROGRAMS, FOODS, RECIPES, SHOPPING } from './data.js'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// ─── UTILS ────────────────────────────────────────────────────
const userKey = (uid, k) => `forge_u${uid}_${k}`

function useUserStorage(uid, key, def) {
  return useStorage(userKey(uid, key), def)
}

// ─── DESIGN PRIMITIVES ────────────────────────────────────────
function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--bg3)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', padding: 16, marginBottom: 10,
      ...(onClick ? { cursor: 'pointer' } : {}), ...style
    }}>{children}</div>
  )
}

function Chip({ label, color = 'var(--text2)', bg = 'var(--bg5)' }) {
  return <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 99, background: bg, color, fontWeight: 500 }}>{label}</span>
}

function SecTitle({ children, mt = 0 }) {
  return <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginBottom: 10, marginTop: mt, fontFamily: 'var(--font-display)', fontSize: 13 }}>{children}</div>
}

function ProgBar({ pct, color, h = 4 }) {
  return (
    <div style={{ height: h, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(pct * 100, 100)}%`, background: color, borderRadius: 99, transition: 'width .5s ease' }} />
    </div>
  )
}

function Ring({ pct, val, lbl, sub, color }) {
  const r = 30, c = 2 * Math.PI * r
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <svg width={74} height={74} viewBox="0 0 74 74">
        <circle cx={37} cy={37} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <circle cx={37} cy={37} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(pct, 1))}
          strokeLinecap="round" transform="rotate(-90 37 37)"
          style={{ transition: 'stroke-dashoffset .6s ease' }} />
        <text x={37} y={41} textAnchor="middle" fill="var(--text)" fontSize={11} fontWeight={700} fontFamily="var(--font-display)">{Math.round(pct * 100)}%</text>
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)', color, letterSpacing: 0.5 }}>{val}</div>
        <div style={{ fontSize: 10, color: 'var(--text3)' }}>{lbl}</div>
        <div style={{ fontSize: 10, color: 'var(--text3)' }}>{sub}</div>
      </div>
    </div>
  )
}

function Btn({ children, onClick, variant = 'primary', style = {}, disabled = false }) {
  const vars = {
    primary: { background: 'var(--accent)', color: '#fff' },
    ghost: { background: 'var(--bg4)', color: 'var(--text)', border: '1px solid var(--border)' },
    danger: { background: 'rgba(255,60,60,0.15)', color: '#ff6060', border: '1px solid rgba(255,60,60,0.2)' },
  }
  return (
    <button disabled={disabled} onClick={onClick} style={{
      padding: '11px 18px', borderRadius: 'var(--r-sm)', fontSize: 14, fontWeight: 600,
      cursor: disabled ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center',
      gap: 6, transition: 'opacity .15s', opacity: disabled ? 0.5 : 1,
      ...vars[variant], ...style
    }}>{children}</button>
  )
}

// ─── AVATAR ───────────────────────────────────────────────────
function Avatar({ name, color, size = 48, style = {} }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : '?'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color || '#444',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, fontFamily: 'var(--font-display)',
      color: '#fff', flexShrink: 0, letterSpacing: 1, ...style
    }}>{initials}</div>
  )
}

// ─── PIN PAD ──────────────────────────────────────────────────
function PinPad({ title, subtitle, onSubmit, error }) {
  const [pin, setPin] = useState('')
  const [shake, setShake] = useState(false)

  const press = (d) => {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    if (next.length === 4) {
      setTimeout(() => { onSubmit(next); setPin('') }, 120)
    }
  }
  const del = () => setPin(p => p.slice(0, -1))

  // trigger shake on error
  useState(() => { if (error) { setShake(true); setTimeout(() => setShake(false), 400) } }, [error])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px' }}>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{subtitle}</div>
      <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: 2, marginBottom: 32 }}>{title}</div>

      {/* Dots */}
      <div className={error ? 'shake' : ''} style={{ display: 'flex', gap: 14, marginBottom: 36 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            width: 14, height: 14, borderRadius: '50%', transition: 'all .15s',
            background: i < pin.length ? 'var(--accent)' : 'var(--bg5)',
            border: `2px solid ${i < pin.length ? 'var(--accent)' : 'var(--border2)'}`,
            transform: i < pin.length ? 'scale(1.2)' : 'scale(1)'
          }} />
        ))}
      </div>

      {error && <div style={{ fontSize: 13, color: '#ff6060', marginBottom: 20, marginTop: -20 }}>{error}</div>}

      {/* Keypad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, width: 240 }}>
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => press(String(n))} style={{
            height: 62, borderRadius: 'var(--r)', background: 'var(--bg4)',
            border: '1px solid var(--border)', color: 'var(--text)',
            fontSize: 22, fontFamily: 'var(--font-display)', letterSpacing: 1,
            cursor: 'pointer', transition: 'background .1s, transform .1s',
            active: { background: 'var(--bg5)' }
          }}>{n}</button>
        ))}
        <div />
        <button onClick={() => press('0')} style={{
          height: 62, borderRadius: 'var(--r)', background: 'var(--bg4)',
          border: '1px solid var(--border)', color: 'var(--text)',
          fontSize: 22, fontFamily: 'var(--font-display)', cursor: 'pointer'
        }}>0</button>
        <button onClick={del} style={{
          height: 62, borderRadius: 'var(--r)', background: 'var(--bg4)',
          border: '1px solid var(--border)', color: 'var(--text2)',
          fontSize: 20, cursor: 'pointer'
        }}>⌫</button>
      </div>
    </div>
  )
}

// ─── CREATE PROFILE SCREEN ────────────────────────────────────
function CreateProfile({ onCreated, onCancel, existingNames }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [color, setColor] = useState(AVATAR_COLORS[0].id)
  const [program, setProgram] = useState('push')
  const [weightCurrent, setWeightCurrent] = useState('')
  const [weightTarget, setWeightTarget] = useState('')
  const [calories, setCalories] = useState('2500')
  const [protein, setProtein] = useState('180')
  const [pin, setPin] = useState('')
  const [pin2, setPin2] = useState('')
  const [err, setErr] = useState('')

  const selectedColor = AVATAR_COLORS.find(c => c.id === color)?.bg || '#7c6af7'

  function next() {
    if (step === 1) {
      if (!name.trim()) return setErr('Entre ton prénom')
      if (existingNames.map(n => n.toLowerCase()).includes(name.trim().toLowerCase())) return setErr('Ce prénom existe déjà')
      setErr(''); setStep(2)
    } else if (step === 2) {
      if (!weightCurrent || !weightTarget) return setErr('Remplis ton poids actuel et cible')
      setErr(''); setStep(3)
    } else if (step === 3) {
      if (!calories || !protein) return setErr('Remplis les objectifs')
      setErr(''); setStep(4)
    } else if (step === 4) {
      if (pin.length < 4) return setErr('PIN de 4 chiffres requis')
      if (pin !== pin2) return setErr('Les PIN ne correspondent pas')
      onCreated({ name: name.trim(), color, program, weightCurrent: parseFloat(weightCurrent), weightTarget: parseFloat(weightTarget), calories: parseInt(calories), protein: parseInt(protein), pinHash: hashPin(pin) })
    }
  }

  return (
    <div className="scale-in" style={{ padding: '24px 20px', maxWidth: 420, margin: '0 auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {[1,2,3,4].map(s => (
          <div key={s} style={{ flex: 1, height: 3, borderRadius: 99, background: s <= step ? 'var(--accent)' : 'var(--bg5)', transition: 'background .3s' }} />
        ))}
      </div>

      {step === 1 && (
        <div className="fade-up">
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', letterSpacing: 2, marginBottom: 6 }}>TON IDENTITÉ</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24 }}>Prénom et couleur de ton profil</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <Avatar name={name || '?'} color={selectedColor} size={56} />
            <input value={name} onChange={e => { setName(e.target.value); setErr('') }}
              placeholder="Ton prénom..."
              style={{ flex: 1, background: 'var(--bg4)', border: '1px solid var(--border2)', borderRadius: 'var(--r-sm)', padding: '12px 14px', color: 'var(--text)', fontSize: 16 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 24 }}>
            {AVATAR_COLORS.map(c => (
              <div key={c.id} onClick={() => setColor(c.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                borderRadius: 'var(--r-sm)', border: `2px solid ${color === c.id ? c.bg : 'var(--border)'}`,
                background: color === c.id ? `${c.bg}18` : 'var(--bg4)', cursor: 'pointer'
              }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: c.bg, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: color === c.id ? c.bg : 'var(--text2)' }}>{c.label}</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>Programme par défaut</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.entries(PROGRAMS).map(([k, p]) => (
                <div key={k} onClick={() => setProgram(k)} style={{
                  padding: '10px 12px', borderRadius: 'var(--r-sm)', cursor: 'pointer',
                  border: `2px solid ${program === k ? 'var(--accent)' : 'var(--border)'}`,
                  background: program === k ? 'rgba(124,106,247,0.1)' : 'var(--bg4)'
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: program === k ? 'var(--accent)' : 'var(--text)' }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{p.days}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="fade-up">
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', letterSpacing: 2, marginBottom: 6 }}>TON POIDS</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24 }}>Données pour suivre ta transformation</div>
          {[
            { label: 'Poids actuel (kg)', val: weightCurrent, set: setWeightCurrent, placeholder: 'ex: 85' },
            { label: 'Poids cible (kg)', val: weightTarget, set: setWeightTarget, placeholder: 'ex: 75' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{f.label}</div>
              <input type="number" value={f.val} onChange={e => { f.set(e.target.value); setErr('') }}
                placeholder={f.placeholder}
                style={{ width: '100%', background: 'var(--bg4)', border: '1px solid var(--border2)', borderRadius: 'var(--r-sm)', padding: '12px 14px', color: 'var(--text)', fontSize: 16 }} />
            </div>
          ))}
          {weightCurrent && weightTarget && (
            <div style={{ background: 'var(--bg4)', borderRadius: 'var(--r-sm)', padding: 12, fontSize: 13, color: 'var(--text2)' }}>
              Objectif : perdre <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{Math.abs(parseFloat(weightCurrent) - parseFloat(weightTarget)).toFixed(1)} kg</span>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="fade-up">
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', letterSpacing: 2, marginBottom: 6 }}>TES OBJECTIFS</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24 }}>Calories et protéines quotidiennes</div>
          {[
            { label: 'Calories objectif / jour', val: calories, set: setCalories, placeholder: '2500' },
            { label: 'Protéines objectif / jour (g)', val: protein, set: setProtein, placeholder: '180' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{f.label}</div>
              <input type="number" value={f.val} onChange={e => { f.set(e.target.value); setErr('') }}
                placeholder={f.placeholder}
                style={{ width: '100%', background: 'var(--bg4)', border: '1px solid var(--border2)', borderRadius: 'var(--r-sm)', padding: '12px 14px', color: 'var(--text)', fontSize: 16 }} />
            </div>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="fade-up">
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', letterSpacing: 2, marginBottom: 6 }}>TON CODE PIN</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>Protège ton profil avec un PIN à 4 chiffres</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>Choisir un PIN</div>
            <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g,'')); setErr('') }}
              placeholder="••••"
              style={{ width: '100%', background: 'var(--bg4)', border: '1px solid var(--border2)', borderRadius: 'var(--r-sm)', padding: '12px 14px', color: 'var(--text)', fontSize: 22, letterSpacing: 8, textAlign: 'center' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>Confirmer le PIN</div>
            <input type="password" inputMode="numeric" maxLength={4} value={pin2} onChange={e => { setPin2(e.target.value.replace(/\D/g,'')); setErr('') }}
              placeholder="••••"
              style={{ width: '100%', background: 'var(--bg4)', border: '1px solid var(--border2)', borderRadius: 'var(--r-sm)', padding: '12px 14px', color: 'var(--text)', fontSize: 22, letterSpacing: 8, textAlign: 'center' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', padding: '8px 12px', background: 'var(--bg4)', borderRadius: 8 }}>
            ⚠️ Si tu oublies ton PIN, tes données ne seront pas récupérables. Note-le quelque part.
          </div>
        </div>
      )}

      {err && <div style={{ fontSize: 13, color: '#ff6060', marginTop: 10 }}>{err}</div>}

      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <Btn variant="ghost" onClick={step === 1 ? onCancel : () => setStep(s => s - 1)} style={{ flex: 1, justifyContent: 'center' }}>
          {step === 1 ? 'Annuler' : '← Retour'}
        </Btn>
        <Btn onClick={next} style={{ flex: 2, justifyContent: 'center' }}>
          {step === 4 ? 'Créer mon profil →' : 'Suivant →'}
        </Btn>
      </div>
    </div>
  )
}

// ─── PROFILE SELECT SCREEN ────────────────────────────────────
function ProfileSelect({ profiles, onSelect, onNew }) {
  const [unlocking, setUnlocking] = useState(null)
  const [pinErr, setPinErr] = useState('')

  function tryPin(pin) {
    const h = hashPin(pin)
    if (h === unlocking.pinHash) { setPinErr(''); onSelect(unlocking) }
    else { setPinErr('PIN incorrect') }
  }

  if (unlocking) {
    return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Avatar name={unlocking.name} color={AVATAR_COLORS.find(c => c.id === unlocking.color)?.bg} size={64} style={{ marginBottom: 12 }} />
        <PinPad
          title={unlocking.name.toUpperCase()}
          subtitle="Entre ton code PIN"
          onSubmit={tryPin}
          error={pinErr}
        />
        <button onClick={() => { setUnlocking(null); setPinErr('') }} style={{ color: 'var(--text2)', fontSize: 13, marginTop: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Choisir un autre profil
        </button>
      </div>
    )
  }

  return (
    <div className="scale-in" style={{ padding: '48px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Logo */}
      <div style={{ fontSize: 52, fontFamily: 'var(--font-display)', letterSpacing: 6, marginBottom: 4, color: 'var(--text)' }}>
        FORGE
      </div>
      <div style={{ fontSize: 13, color: 'var(--text3)', letterSpacing: 3, marginBottom: 48, textTransform: 'uppercase' }}>
        Forge ton physique
      </div>

      {profiles.length > 0 && (
        <>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, alignSelf: 'flex-start' }}>Choisir un profil</div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {profiles.map(p => {
              const col = AVATAR_COLORS.find(c => c.id === p.color)?.bg || '#7c6af7'
              return (
                <div key={p.id} onClick={() => setUnlocking(p)} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: 'var(--r)', padding: '14px 16px', cursor: 'pointer',
                  transition: 'border-color .15s'
                }}>
                  <Avatar name={p.name} color={col} size={46} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>{p.name.toUpperCase()}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
                      {PROGRAMS[p.program]?.label} · {p.weightTarget} kg objectif
                    </div>
                  </div>
                  <div style={{ fontSize: 18, color: 'var(--text3)' }}>🔒</div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {profiles.length < 6 && (
        <Btn onClick={onNew} style={{ width: '100%', justifyContent: 'center' }}>
          + Créer un profil
        </Btn>
      )}

      {profiles.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, marginBottom: 24 }}>
          Aucun profil. Crée le tien pour commencer.
        </div>
      )}
    </div>
  )
}

// ─── INNER APP (authenticated) ───────────────────────────────
function InnerApp({ profile, onLock }) {
  const uid = profile.id
  const col = AVATAR_COLORS.find(c => c.id === profile.color)?.bg || '#7c6af7'
  const [page, setPage] = useState('home')
  const [todayLog, setTodayLog] = useUserStorage(uid, 'food', {})
  const [sessionSets, setSessionSets] = useUserStorage(uid, 'sets', {})
  const [sessionsDone, setSessionsDone] = useUserStorage(uid, 'done', {})
  const [weights, setWeights] = useUserStorage(uid, 'weights', [])
  const [prs, setPrs] = useUserStorage(uid, 'prs', {
    squat: { current: 0, target: 100, label: 'Squat barre' },
    bench: { current: 0, target: 100, label: 'Développé couché' },
    deadlift: { current: 0, target: 140, label: 'Soulevé de terre' },
    ohp: { current: 0, target: 60, label: 'Développé militaire' },
  })

  const today = todayKey()
  const wk = weekKey()
  const entry = todayLog[today] || { items: [] }
  const totalKcal = entry.items?.reduce((s, i) => s + i.kcal, 0) || 0
  const totalP = entry.items?.reduce((s, i) => s + i.p, 0) || 0
  const thisWeek = sessionsDone[wk] || []
  const currentWeight = weights.length > 0 ? weights[weights.length - 1].w : profile.weightCurrent

  const nav = (p) => setPage(p)

  const pages = {
    home: <HomePage profile={profile} col={col} entry={entry} totalKcal={totalKcal} totalP={totalP} thisWeek={thisWeek} currentWeight={currentWeight} nav={nav} />,
    workout: <WorkoutPage uid={uid} profile={profile} col={col} sessionSets={sessionSets} setSessionSets={setSessionSets} sessionsDone={sessionsDone} setSessionsDone={setSessionsDone} />,
    nutrition: <NutritionPage uid={uid} profile={profile} todayLog={todayLog} setTodayLog={setTodayLog} entry={entry} totalKcal={totalKcal} />,
    progress: <ProgressPage profile={profile} weights={weights} setWeights={setWeights} prs={prs} setPrs={setPrs} currentWeight={currentWeight} />,
    recipes: <RecipesPage uid={uid} />,
    me: <MePage profile={profile} col={col} onLock={onLock} weights={weights} thisWeek={thisWeek} />,
  }

  const tabs = [
    { id: 'home', emoji: '⌂', label: 'Accueil' },
    { id: 'workout', emoji: '⚡', label: 'Séance' },
    { id: 'nutrition', emoji: '◉', label: 'Nutrition' },
    { id: 'progress', emoji: '↑', label: 'Progress' },
    { id: 'recipes', emoji: '✦', label: 'Recettes' },
    { id: 'me', emoji: '◎', label: 'Moi' },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', maxWidth: 480, margin: '0 auto', position: 'relative' }}
      style={{ '--accent': col, height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', maxWidth: 480, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'var(--bg)' }}>
        <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', letterSpacing: 3, color: 'var(--text)' }}>
          FORGE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
          <Avatar name={profile.name} color={col} size={30} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 70 }}>
        {pages[page]}
      </div>

      {/* Bottom nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: 'var(--bg2)', borderTop: '1px solid var(--border)', display: 'flex', paddingBottom: 'var(--safe-bottom)', zIndex: 100 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => nav(t.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '8px 4px 10px', background: 'none', border: 'none', cursor: 'pointer'
          }}>
            <span style={{ fontSize: 16, filter: page === t.id ? `drop-shadow(0 0 5px ${col})` : 'none', opacity: page === t.id ? 1 : 0.35, transition: 'all .15s' }}>{t.emoji}</span>
            <span style={{ fontSize: 9, color: page === t.id ? col : 'var(--text3)', fontWeight: page === t.id ? 600 : 400 }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// ─── HOME ─────────────────────────────────────────────────────
function HomePage({ profile, col, entry, totalKcal, totalP, thisWeek, currentWeight, nav }) {
  const days = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
  const todayIdx = (new Date().getDay() + 6) % 7
  const weightToLose = (currentWeight - profile.weightTarget).toFixed(1)
  const goalProg = Math.max(0, 1 - (currentWeight - profile.weightTarget) / Math.max(profile.weightCurrent - profile.weightTarget, 0.1))

  return (
    <div className="fade-up" style={{ padding: '16px 16px 0' }}>
      {/* Hero */}
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -30, width: 140, height: 140, background: col, opacity: 0.07, borderRadius: '50%' }} />
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 2 }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <div style={{ fontSize: 26, fontFamily: 'var(--font-display)', letterSpacing: 1, marginBottom: 16 }}>
          PRÊT, {profile.name.toUpperCase()}? 💪
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
            { v: currentWeight.toFixed(1), l: 'kg actuel', c: col },
            { v: profile.weightTarget, l: 'kg objectif', c: '#4de8b0' },
            { v: Math.max(0, weightToLose), l: 'kg à perdre', c: '#ffa04a' },
          ].map(s => (
            <div key={s.l} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--r-sm)', padding: '9px 8px' }}>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: s.c, letterSpacing: 0.5 }}>{s.v}</div>
              <div style={{ fontSize: 10, color: 'var(--text2)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak */}
      <SecTitle>Séances cette semaine ({thisWeek.length}/{5})</SecTitle>
      <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
        {days.map((d, i) => (
          <div key={d} style={{
            flex: 1, background: thisWeek.includes(i) ? `${col}18` : 'var(--bg3)',
            border: `1px solid ${i === todayIdx ? col : thisWeek.includes(i) ? `${col}44` : 'var(--border)'}`,
            borderRadius: 'var(--r-sm)', padding: '7px 2px', textAlign: 'center'
          }}>
            <div style={{ fontSize: 9, color: 'var(--text2)', marginBottom: 4 }}>{d}</div>
            <div style={{ width: 6, height: 6, borderRadius: '50%', margin: '0 auto', background: thisWeek.includes(i) ? col : i === todayIdx ? col : 'var(--text3)', opacity: i === todayIdx && !thisWeek.includes(i) ? 0.5 : 1 }} />
          </div>
        ))}
      </div>

      {/* Rings */}
      <Card style={{ display: 'flex', justifyContent: 'space-around', padding: '16px 8px' }}>
        <Ring pct={totalKcal / profile.calories} val={Math.round(totalKcal)} lbl="kcal" sub={`/${profile.calories}`} color="#ffa04a" />
        <Ring pct={totalP / profile.protein} val={`${Math.round(totalP)}g`} lbl="protéines" sub={`/${profile.protein}g`} color="#60a5fa" />
        <Ring pct={goalProg} val={`${Math.round(goalProg*100)}%`} lbl="objectif" sub="poids" color={col} />
      </Card>

      {/* Quick actions */}
      <SecTitle mt={4}>Actions rapides</SecTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { e: '⚡', t: 'Séance du jour', s: PROGRAMS[profile.program]?.label || 'PPL', p: 'workout' },
          { e: '◉', t: 'Nutrition', s: `${Math.round(totalKcal)} / ${profile.calories} kcal`, p: 'nutrition' },
          { e: '↑', t: 'Progression', s: `${currentWeight.toFixed(1)} → ${profile.weightTarget} kg`, p: 'progress' },
          { e: '✦', t: 'Recettes', s: 'Haute protéine', p: 'recipes' },
        ].map(a => (
          <div key={a.p} onClick={() => nav(a.p)} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 14, cursor: 'pointer'
          }}>
            <div style={{ fontSize: 24, marginBottom: 8, color: col }}>{a.e}</div>
            <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: 0.5, marginBottom: 2 }}>{a.t}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{a.s}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── WORKOUT ──────────────────────────────────────────────────
function WorkoutPage({ uid, profile, col, sessionSets, setSessionSets, sessionsDone, setSessionsDone }) {
  const [tab, setTab] = useState(profile.program || 'push')
  const prog = PROGRAMS[tab]
  const today = todayKey(), wk = weekKey()
  const key = `${tab}_${today}`
  const curSets = sessionSets[key] || {}

  function toggle(exId, si) {
    const exSets = curSets[exId] ? [...curSets[exId]] : Array(prog.exercises.find(e => e.id === exId).sets).fill(false)
    exSets[si] = !exSets[si]
    const updated = { ...curSets, [exId]: exSets }
    setSessionSets({ ...sessionSets, [key]: updated })
    if (Object.values(updated).some(s => s.some(Boolean))) {
      const tidx = (new Date().getDay() + 6) % 7
      const wkDays = sessionsDone[wk] || []
      if (!wkDays.includes(tidx)) setSessionsDone({ ...sessionsDone, [wk]: [...wkDays, tidx] })
    }
  }

  const totalSets = prog.exercises.reduce((s, e) => s + e.sets, 0)
  const doneSets = Object.values(curSets).reduce((s, sets) => s + sets.filter(Boolean).length, 0)

  return (
    <div className="fade-up" style={{ padding: '16px 16px 0' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, background: 'var(--bg2)', padding: 4, borderRadius: 'var(--r-sm)' }}>
        {Object.keys(PROGRAMS).map(k => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 6, border: 'none',
            background: tab === k ? 'var(--bg5)' : 'transparent',
            color: tab === k ? 'var(--text)' : 'var(--text2)',
            fontSize: 12, fontWeight: tab === k ? 600 : 400, cursor: 'pointer',
            fontFamily: 'var(--font-display)', letterSpacing: 0.5, transition: 'all .15s'
          }}>{PROGRAMS[k].label}</button>
        ))}
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', letterSpacing: 1, color: col }}>{prog.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 1 }}>{prog.days}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: col }}>{doneSets}/{totalSets}</div>
            <div style={{ fontSize: 10, color: 'var(--text2)' }}>séries</div>
          </div>
        </div>
        <ProgBar pct={doneSets / totalSets} color={col} h={3} />
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
          {prog.muscles.map(m => <span key={m} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'var(--bg5)', color: 'var(--text2)', border: '1px solid var(--border)' }}>{m}</span>)}
        </div>
      </Card>

      {prog.exercises.map(ex => {
        const exSets = curSets[ex.id] || Array(ex.sets).fill(false)
        const done = exSets.filter(Boolean).length
        return (
          <Card key={ex.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 1 }}>{ex.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>{ex.detail}</div>
              </div>
              <div style={{ fontSize: 12, color: done === ex.sets ? '#4de8b0' : 'var(--text3)', marginLeft: 8 }}>{done}/{ex.sets}</div>
            </div>
            {ex.note && <div style={{ fontSize: 11, color: 'var(--text3)', background: 'var(--bg4)', borderRadius: 6, padding: '4px 8px', marginBottom: 8, borderLeft: `2px solid ${col}` }}>💡 {ex.note}</div>}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Array(ex.sets).fill(0).map((_, i) => (
                <div key={i} onClick={() => toggle(ex.id, i)} style={{
                  width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: exSets[i] ? 14 : 12, fontWeight: 600,
                  background: exSets[i] ? `${col}22` : 'var(--bg4)',
                  border: `1px solid ${exSets[i] ? col : 'var(--border)'}`,
                  color: exSets[i] ? col : 'var(--text2)',
                  transition: 'all .15s'
                }}>{exSets[i] ? '✓' : i + 1}</div>
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// ─── NUTRITION ────────────────────────────────────────────────
function NutritionPage({ uid, profile, todayLog, setTodayLog, entry, totalKcal }) {
  const [search, setSearch] = useState('')
  const today = todayKey()
  const totalP = entry.items?.reduce((s, i) => s + i.p, 0) || 0
  const totalG = entry.items?.reduce((s, i) => s + i.g, 0) || 0
  const totalL = entry.items?.reduce((s, i) => s + i.l, 0) || 0
  const results = search.length > 1 ? FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5) : []

  function addFood(food) {
    const item = { id: Date.now(), name: food.name, kcal: food.kcal, p: food.p, g: food.g, l: food.l, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    setTodayLog({ ...todayLog, [today]: { items: [...(entry.items || []), item] } })
    setSearch('')
  }

  function remove(id) {
    setTodayLog({ ...todayLog, [today]: { items: entry.items.filter(i => i.id !== id) } })
  }

  return (
    <div className="fade-up" style={{ padding: '16px 16px 0' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          {[{ v: Math.round(totalKcal), l: 'consommé' }, { v: Math.max(0, profile.calories - Math.round(totalKcal)), l: 'restant', c: 'var(--accent)' }, { v: profile.calories, l: 'objectif', c: 'var(--text2)' }].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', color: s.c || 'var(--text)' }}>{s.v}</div>
              <div style={{ fontSize: 10, color: 'var(--text2)' }}>{s.l}</div>
            </div>
          ))}
        </div>
        <ProgBar pct={totalKcal / profile.calories} color="var(--accent)" h={5} />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
        {[{ v: `${Math.round(totalP)}g`, l: 'Protéines', t: profile.protein, c: '#60a5fa' }, { v: `${Math.round(totalG)}g`, l: 'Glucides', t: 280, c: '#ffa04a' }, { v: `${Math.round(totalL)}g`, l: 'Lipides', t: 80, c: '#4de8b0' }].map(m => (
          <div key={m.l} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)', color: m.c }}>{m.v}</div>
            <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 5 }}>{m.l}</div>
            <ProgBar pct={parseFloat(m.v) / m.t} color={m.c} h={3} />
          </div>
        ))}
      </div>

      <Card>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Chercher un aliment..."
          style={{ width: '100%', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 12px', color: 'var(--text)', fontSize: 14 }} />
        {results.map(f => (
          <div key={f.id} onClick={() => addFood(f)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: 14 }}>{f.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>{f.p}g prot · {f.g}g gluc</div>
            </div>
            <div style={{ fontSize: 14, color: '#ffa04a', fontWeight: 600 }}>+{f.kcal}</div>
          </div>
        ))}
      </Card>

      {entry.items?.length > 0 && (
        <>
          <SecTitle mt={4}>Repas aujourd'hui</SecTitle>
          <Card>
            {entry.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)' }}>{item.time} · {item.p}g prot</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, color: '#ffa04a', fontWeight: 600 }}>{item.kcal}</span>
                  <button onClick={() => remove(item.id)} style={{ color: 'var(--text3)', fontSize: 16, cursor: 'pointer' }}>✕</button>
                </div>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  )
}

// ─── PROGRESS ─────────────────────────────────────────────────
function ProgressPage({ profile, weights, setWeights, prs, setPrs, currentWeight }) {
  const [newW, setNewW] = useState('')
  const [editPr, setEditPr] = useState(null)
  const [prVal, setPrVal] = useState('')

  const chartData = weights.slice(-10).map(e => ({ date: e.date.slice(5), poids: e.w }))
  const goalProg = Math.max(0, 1 - (currentWeight - profile.weightTarget) / Math.max(profile.weightCurrent - profile.weightTarget, 0.1))

  return (
    <div className="fade-up" style={{ padding: '16px 16px 0' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {currentWeight.toFixed(1)}<span style={{ fontSize: 18, color: 'var(--text2)', fontWeight: 400 }}> kg</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Objectif : {profile.weightTarget} kg</div>
          </div>
          <svg viewBox="0 0 72 72" width={68} height={68}>
            <circle cx={36} cy={36} r={28} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
            <circle cx={36} cy={36} r={28} fill="none" stroke="var(--accent)"
              strokeWidth={6} strokeDasharray={175.93}
              strokeDashoffset={175.93 * (1 - Math.min(goalProg, 1))}
              strokeLinecap="round" transform="rotate(-90 36 36)" />
            <text x={36} y={40} textAnchor="middle" fill="var(--text)" fontSize={12} fontWeight={700} fontFamily="var(--font-display)">{Math.round(goalProg * 100)}%</text>
          </svg>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="number" step="0.1" value={newW} onChange={e => setNewW(e.target.value)} placeholder="Poids ce matin..."
            style={{ flex: 1, background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 12px', color: 'var(--text)', fontSize: 15 }} />
          <Btn onClick={() => { const w = parseFloat(newW); if (w > 0) { setWeights([...weights, { date: todayKey(), w, ts: Date.now() }]); setNewW('') } }}>Sauver</Btn>
        </div>
      </Card>

      {chartData.length > 1 && (
        <Card>
          <div style={{ fontSize: 14, fontFamily: 'var(--font-display)', letterSpacing: 1, marginBottom: 12 }}>ÉVOLUTION POIDS</div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text3)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--text3)', fontSize: 9 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip contentStyle={{ background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }} />
              <Line type="monotone" dataKey="poids" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      <SecTitle mt={4}>Records personnels</SecTitle>
      <Card>
        {Object.entries(prs).map(([k, pr]) => (
          <div key={k} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{pr.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text2)' }}>Cible : {pr.target} kg</div>
              </div>
              {editPr === k ? (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="number" value={prVal} onChange={e => setPrVal(e.target.value)}
                    style={{ width: 64, background: 'var(--bg4)', border: '1px solid var(--accent)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 14, textAlign: 'center' }} />
                  <button onClick={() => { const v = parseFloat(prVal); if (v > 0) setPrs({ ...prs, [k]: { ...pr, current: v } }); setEditPr(null) }}
                    style={{ color: '#4de8b0', fontSize: 18, cursor: 'pointer', background: 'none', border: 'none' }}>✓</button>
                </div>
              ) : (
                <div onClick={() => { setEditPr(k); setPrVal(pr.current) }} style={{ cursor: 'pointer' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{pr.current || '—'}</span>
                  {pr.current > 0 && <span style={{ fontSize: 12, color: 'var(--text2)' }}> kg</span>}
                </div>
              )}
            </div>
            <ProgBar pct={pr.current / pr.target} color="var(--accent)" h={4} />
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── RECIPES ──────────────────────────────────────────────────
function RecipesPage({ uid }) {
  const [selected, setSelected] = useState(null)
  const [shopping, setShopping] = useStorage(`forge_u${uid}_shopping`, {})

  if (selected !== null) {
    const r = RECIPES[selected]
    return (
      <div className="fade-up" style={{ padding: '16px 16px 0' }}>
        <button onClick={() => setSelected(null)} style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 12, cursor: 'pointer', background: 'none', border: 'none' }}>← Retour</button>
        <div style={{ fontSize: 52, textAlign: 'center', marginBottom: 8 }}>{r.emoji}</div>
        <div style={{ fontSize: 20, fontFamily: 'var(--font-display)', letterSpacing: 1, marginBottom: 4 }}>{r.name.toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          <Chip label={`${r.p}g prot`} color="#60a5fa" bg="rgba(96,165,250,0.1)" />
          <Chip label={`${r.kcal} kcal`} color="#ffa04a" bg="rgba(255,160,74,0.1)" />
          <Chip label={r.time} />
        </div>
        <SecTitle>Ingrédients</SecTitle>
        <Card>{r.ingredients.map((ing, i) => <div key={i} style={{ padding: '7px 0', borderBottom: i < r.ingredients.length-1 ? '1px solid var(--border)' : 'none', fontSize: 14 }}>· {ing}</div>)}</Card>
        <SecTitle mt={8}>Préparation</SecTitle>
        <Card>
          {r.steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < r.steps.length-1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>{s}</div>
            </div>
          ))}
        </Card>
      </div>
    )
  }

  return (
    <div className="fade-up" style={{ padding: '16px 16px 0' }}>
      <SecTitle>Recettes haute protéine</SecTitle>
      {RECIPES.map((r, i) => (
        <Card key={r.id} onClick={() => setSelected(i)} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ fontSize: 32 }}>{r.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: 0.5, marginBottom: 4 }}>{r.name.toUpperCase()}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Chip label={`${r.p}g prot`} color="#60a5fa" bg="rgba(96,165,250,0.1)" />
                <Chip label={`${r.kcal} kcal`} color="#ffa04a" bg="rgba(255,160,74,0.1)" />
                <Chip label={r.time} />
              </div>
            </div>
          </div>
        </Card>
      ))}

      <SecTitle mt={8}>Liste de courses</SecTitle>
      {Object.entries(SHOPPING).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{cat}</div>
          <Card style={{ padding: '8px 14px' }}>
            {items.map(item => (
              <div key={item.id} onClick={() => setShopping(p => ({ ...p, [item.id]: !p[item.id] }))} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${shopping[item.id] ? '#4de8b0' : 'var(--border2)'}`, background: shopping[item.id] ? 'rgba(77,232,176,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {shopping[item.id] && <span style={{ fontSize: 11, color: '#4de8b0' }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, flex: 1, color: shopping[item.id] ? 'var(--text3)' : 'var(--text)', textDecoration: shopping[item.id] ? 'line-through' : 'none' }}>{item.name}</span>
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>{item.qty}</span>
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  )
}

// ─── ME PAGE ──────────────────────────────────────────────────
function MePage({ profile, col, onLock, weights, thisWeek }) {
  const currentWeight = weights.length > 0 ? weights[weights.length - 1].w : profile.weightCurrent
  return (
    <div className="fade-up" style={{ padding: '16px 16px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0 16px' }}>
        <Avatar name={profile.name} color={col} size={72} style={{ marginBottom: 12, border: '3px solid var(--bg5)' }} />
        <div style={{ fontSize: 26, fontFamily: 'var(--font-display)', letterSpacing: 2 }}>{profile.name.toUpperCase()}</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Programme {PROGRAMS[profile.program]?.label}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Chip label={`${currentWeight.toFixed(1)} kg`} />
          <Chip label={`Objectif ${profile.weightTarget} kg`} color={col} bg={`${col}18`} />
          <Chip label={`${profile.calories} kcal/j`} />
        </div>
      </div>

      <SecTitle>Mes objectifs</SecTitle>
      <Card>
        {[
          { l: 'Poids actuel', v: `${currentWeight.toFixed(1)} kg` },
          { l: 'Poids cible', v: `${profile.weightTarget} kg`, c: '#4de8b0' },
          { l: 'Calories / jour', v: `${profile.calories} kcal` },
          { l: 'Protéines / jour', v: `${profile.protein} g` },
          { l: 'Programme', v: PROGRAMS[profile.program]?.label },
          { l: 'Séances semaine', v: `${thisWeek.length} / 5` },
        ].map(o => (
          <div key={o.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
            <span style={{ color: 'var(--text2)' }}>{o.l}</span>
            <span style={{ fontWeight: 600, color: o.c || 'var(--text)' }}>{o.v}</span>
          </div>
        ))}
      </Card>

      <div style={{ marginTop: 16 }}>
        <Btn variant="danger" onClick={onLock} style={{ width: '100%', justifyContent: 'center' }}>
          🔒 Verrouiller mon profil
        </Btn>
      </div>
      <div style={{ textAlign: 'center', padding: '16px 0 8px', fontSize: 11, color: 'var(--text3)' }}>
        FORGE v1.0 · Données stockées localement
      </div>
    </div>
  )
}

// ─── ROOT APP ─────────────────────────────────────────────────
export default function App() {
  const [profiles, setProfiles] = useStorage('forge_profiles', [])
  const [activeProfile, setActiveProfile] = useState(null)
  const [creating, setCreating] = useState(false)

  function handleCreate(data) {
    const newProfile = { ...data, id: Date.now().toString() }
    setProfiles(prev => [...prev, newProfile])
    setCreating(false)
    setActiveProfile(newProfile)
  }

  function handleLock() { setActiveProfile(null) }

  if (activeProfile) {
    return (
      <div style={{ height: '100%', '--accent': AVATAR_COLORS.find(c => c.id === activeProfile.color)?.bg || '#7c6af7' }}>
        <InnerApp profile={activeProfile} onLock={handleLock} />
      </div>
    )
  }

  if (creating) {
    return (
      <div style={{ height: '100%', overflowY: 'auto', background: 'var(--bg)' }}>
        <CreateProfile
          onCreated={handleCreate}
          onCancel={() => setCreating(false)}
          existingNames={profiles.map(p => p.name)}
        />
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--bg)' }}>
      <ProfileSelect
        profiles={profiles}
        onSelect={setActiveProfile}
        onNew={() => setCreating(true)}
      />
    </div>
  )
}
