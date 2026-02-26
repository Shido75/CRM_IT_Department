'use client'

import React from "react"
import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './auth'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'manager' | 'employee'
  department: string | null
  phone: string | null
  avatar_url: string | null
  status: string
  requires_password_change: boolean
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PROFILE_CACHE_KEY = 'crm_profile_cache'

function getCachedProfile(userId: string): UserProfile | null {
  try {
    const raw = sessionStorage.getItem(PROFILE_CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw)
    if (cached?.id === userId) return cached as UserProfile
  } catch { }
  return null
}

function setCachedProfile(profile: UserProfile) {
  try {
    sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile))
  } catch { }
}

function clearCachedProfile() {
  try {
    sessionStorage.removeItem(PROFILE_CACHE_KEY)
  } catch { }
}

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error || !data) return null
  return data as UserProfile
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        // Fire getUser and session check concurrently
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

        if (!isMounted) return

        if (userError || !currentUser) {
          setUser(null)
          setProfile(null)
          setError(userError?.message || null)
        } else {
          setUser(currentUser)

          // Try cache first — instant load, no network round-trip
          const cached = getCachedProfile(currentUser.id)
          if (cached) {
            setProfile(cached)
            setLoading(false)
            // Refresh in background without blocking UI
            fetchProfile(currentUser.id).then((fresh) => {
              if (fresh && isMounted) {
                setProfile(fresh)
                setCachedProfile(fresh)
              }
            })
            return
          }

          // No cache — fetch and store
          const profileData = await fetchProfile(currentUser.id)
          if (isMounted && profileData) {
            setProfile(profileData)
            setCachedProfile(profileData)
          }
        }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : 'Auth error')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    init()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          clearCachedProfile()
          return
        }

        if (session?.user) {
          setUser(session.user)
          // Use cache if available, refresh in background
          const cached = getCachedProfile(session.user.id)
          if (cached) {
            setProfile(cached)
          }
          fetchProfile(session.user.id).then((fresh) => {
            if (fresh && isMounted) {
              setProfile(fresh)
              setCachedProfile(fresh)
            }
          })
        }
      }
    )

    return () => {
      isMounted = false
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    clearCachedProfile()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
