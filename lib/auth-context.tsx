"use client"
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  hydrated: boolean
}

const STORAGE_KEY = "menuexpress-user"
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
  if (user) return // ya está logueado con el sistema propio
  // Verificar si hay sesión de NextAuth (Google)
  fetch('/api/auth/session')
    .then(res => res.json())
    .then(data => {
      if (data?.user?.email) {
        const nextAuthUser: User = {
          id: data.user.id ?? data.user.email,
          name: data.user.name ?? "Usuario",
          email: data.user.email,
        }
        setUser(nextAuthUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuthUser))
      }
      setHydrated(true)
    })
    .catch(() => setHydrated(true))
}, [])

  // 1. LOGIN REAL CON CONEXIÓN A LA API
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        return { ok: false, error: data.error || "Error al iniciar sesión." }
      }

      // Si salió bien, guardamos el usuario real que devolvió MongoDB
      const loggedUser: User = data.user
      setUser(loggedUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser))
      return { ok: true }

    } catch (error) {
      return { ok: false, error: "No se pudo conectar con el servidor." }
    }
  }

  // 2. REGISTRO REAL CON CONEXIÓN A LA API
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        return { ok: false, error: data.error || "Error al registrarse." }
      }

      // Auto-login después de registrarse exitosamente
      return await login(email, password)

    } catch (error) {
      return { ok: false, error: "No se pudo conectar con el servidor." }
    }
  }

  const logout = () => {
    setUser(null)
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, hydrated }}>
      {children}
    </AuthContext.Provider>
  )}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}