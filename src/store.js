import { useState, useEffect } from 'react'

export function useStorage(key, def) {
  const [v, set] = useState(() => {
    try { const s = localStorage.getItem(key); return s !== null ? JSON.parse(s) : def }
    catch { return def }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch {} }, [key, v])
  return [v, set]
}

export function todayKey() { return new Date().toISOString().split('T')[0] }
export function weekKey() {
  const d = new Date(), day = d.getDay()
  const mon = new Date(d)
  mon.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return mon.toISOString().split('T')[0]
}

// Simple PIN hash (not cryptographic, just obfuscation for privacy)
export function hashPin(pin) {
  let h = 0
  for (let i = 0; i < pin.length; i++) { h = ((h << 5) - h) + pin.charCodeAt(i); h |= 0 }
  return h.toString(36)
}
