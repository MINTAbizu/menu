import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AuthSession, AuthUser } from './types'
import { apiBaseUrl } from './api'

const storageKey = 'hospitality_auth'

const loadAuth = (): AuthSession | null => {
  const json = localStorage.getItem(storageKey)
  if (!json) return null

  try {
    return JSON.parse(json) as AuthSession
  } catch {
    return null
  }
}

const saveAuth = (session: AuthSession) => {
  localStorage.setItem(storageKey, JSON.stringify(session))
}

const clearAuth = () => {
  localStorage.removeItem(storageKey)
}

export const authClient = {
  async login(email: string, password: string) {
    const res = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.message || 'Login failed')
    }

    return (await res.json()) as AuthSession
  },

  loadAuth,
  saveAuth,
  clearAuth,
}

export const AuthContext = createContext<{
  session: AuthSession | null
  login: (email: string, password: string) => Promise<AuthSession>
  logout: () => void
  refreshSession: (session: AuthSession | null) => void
} | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(() => loadAuth())

  const login = async (email: string, password: string) => {
    const response = await authClient.login(email, password)
    saveAuth(response)
    setSession(response)
    return response
  }

  const logout = () => {
    clearAuth()
    setSession(null)
  }

  const value = useMemo(
    () => ({ session, login, logout, refreshSession: setSession }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const getAuthHeader = () => {
  const auth = loadAuth()
  return auth ? `Bearer ${auth.tokens.accessToken}` : undefined
}

export const getAuthUser = (): AuthUser | null => {
  const auth = loadAuth()
  return auth ? auth.user : null
}
