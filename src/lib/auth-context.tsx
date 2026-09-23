'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface UserInfo {
  id: string
  email: string
  nickname: string
  avatar: string | null
  bio: string | null
  createdAt: string
}

interface AuthContextValue {
  user: UserInfo | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (email: string, password: string, nickname: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateUser: (data: Partial<UserInfo>) => Promise<{ ok: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.user) {
        setUser(data.user)
        return { ok: true }
      }
      return { ok: false, error: data.error || 'Login failed' }
    } catch {
      return { ok: false, error: 'Network error' }
    }
  }, [])

  const register = useCallback(async (email: string, password: string, nickname: string, code: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, nickname, code}),
      })
      const data = await res.json()
      if (res.ok && data.user) {
        setUser(data.user)
        return { ok: true }
      }
      return { ok: false, error: data.error || 'Registration failed' }
    } catch {
      return { ok: false, error: 'Network error' }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // ignore
    }
    setUser(null)
  }, [])

  const updateUser = useCallback(async (data: Partial<UserInfo>) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (res.ok && result.user) {
        setUser(result.user)
        return { ok: true }
      }
      return { ok: false, error: result.error || 'Update failed' }
    } catch {
      return { ok: false, error: 'Network error' }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
