'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type UserRole = 'patient' | 'doctor' | 'admin' | 'staff' | null

export interface AuthState {
  role: UserRole
  userId: string | null
  displayName: string | null
}

interface AuthContextValue extends AuthState {
  login: (state: AuthState) => void
  logout: () => void
}

const defaultState: AuthState = { role: null, userId: null, displayName: null }

const AuthContext = createContext<AuthContextValue>({
  ...defaultState,
  login: () => {},
  logout: () => {},
})

const STORAGE_KEY = 'hc_auth_state'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState)

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw) as AuthState
        setState(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      }
    } catch {}
  }, [state])

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    login: (next: AuthState) => setState(next),
    logout: () => {
      // Reset state to logged out
      setState(defaultState)
      // Redirect immediately without delay
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    },
  }), [state])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}


