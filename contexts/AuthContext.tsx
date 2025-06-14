"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  firebaseReady: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [firebaseReady, setFirebaseReady] = useState(false)

  useEffect(() => {
    let mounted = true
    let unsubscribe: (() => void) | undefined

    const initializeAuth = async () => {
      try {
        // Check if Firebase is configured
        const { isFirebaseConfigured } = await import("@/lib/firebase")

        if (!mounted) return

        if (isFirebaseConfigured) {
          // Import Firebase auth functions only when needed
          const { auth } = await import("@/lib/firebase")
          const { onAuthStateChanged } = await import("firebase/auth")

          setFirebaseReady(true)

          // Set up auth state listener
          unsubscribe = onAuthStateChanged(auth, (user) => {
            if (mounted) {
              setUser(user)
              setLoading(false)
            }
          })
        } else {
          // Demo mode
          setFirebaseReady(false)
          setLoading(false)
          // Set demo user for development
          setUser({
            uid: "demo-user",
            email: "admin@library.com",
            displayName: "Demo Admin",
          } as User)
        }
      } catch (error) {
        console.error("Firebase Auth initialization error:", error)
        if (mounted) {
          setFirebaseReady(false)
          setLoading(false)
          // Set demo user for development
          setUser({
            uid: "demo-user",
            email: "admin@library.com",
            displayName: "Demo Admin",
          } as User)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    if (!firebaseReady) {
      // Demo login
      if (email === "admin@library.com" && password === "admin123") {
        setUser({
          uid: "demo-user",
          email: "admin@library.com",
          displayName: "Demo Admin",
        } as User)
        return
      } else {
        throw new Error("Invalid credentials. Use admin@library.com / admin123 for demo.")
      }
    }

    try {
      const { auth } = await import("@/lib/firebase")
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error("Login error:", error)
      throw new Error(error.message || "Login failed")
    }
  }

  const logout = async () => {
    if (!firebaseReady) {
      setUser(null)
      return
    }

    try {
      const { auth } = await import("@/lib/firebase")
      const { signOut } = await import("firebase/auth")
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, firebaseReady }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
