import { useEffect, useState } from 'react'

/**
 * Persists state in localStorage so the spend form survives reloads (MVP req).
 */
export function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return initialValue
      return { ...initialValue, ...JSON.parse(raw) }
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* quota / private mode */
    }
  }, [key, state])

  return [state, setState]
}
