"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

interface User {
  name: string
  email: string
}

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  hydrated: boolean
}

// Usuarios hardcodeados — reemplazar con Supabase Auth en producción
const MOCK_USERS: Record<string, { password: string; name: string }> = {
  "demo@menuexpress.com": { password: "demo1234", name: "Usuario Demo" },
  "admin@menuexpress.com": { password: "admin1234", name: "Admin" },
}

const STORAGE_KEY = "menuexpress-user"
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,     setUser]     = useState<User | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  const login = async (email: string, password: string) => {
    // Simular latencia de red
    await new Promise((r) => setTimeout(r, 800))
    const found = MOCK_USERS[email.toLowerCase().trim()]
    if (!found || found.password !== password) {
      return { ok: false, error: "Email o contraseña incorrectos." }
    }
    const u: User = { name: found.name, email: email.toLowerCase().trim() }
    setUser(u)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)) } catch { /* ignore */ }
    return { ok: true }
  }

  const logout = () => {
    setUser(null)
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hydrated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
