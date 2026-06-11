"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export function LoginScreen() {
  const { login } = useAuth()

  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError("Completá todos los campos."); return }
    setError("")
    setLoading(true)
    const res = await login(email, password)
    setLoading(false)
    if (!res.ok) setError(res.error ?? "Error desconocido.")
  }

  const fillDemo = () => {
    setEmail("demo@menuexpress.com")
    setPassword("demo1234")
    setError("")
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #1a3c2e 0%, #2d7a4f 60%, #f5a623 200%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none fixed top-0 right-0 size-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "#3dba72" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 size-72 rounded-full opacity-10 blur-3xl"
        style={{ background: "#f5a623" }}
        aria-hidden="true"
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold text-white tracking-tight"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-1px" }}
          >
            Menu<span style={{ color: "#3dba72" }}>Express</span>
          </h1>
          <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.6)" }}>
            Tu planificador gastronómico inteligente
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <h2
            className="text-xl font-bold text-foreground mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Bienvenido de vuelta
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Ingresá para acceder a tu planificador.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #1a3c2e 0%, #2d7a4f 100%)" }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Ingresando...
                </>
              ) : (
                "Ingresar →"
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 rounded-xl p-3" style={{ background: "#f0faf4", border: "1px solid #a8dfc0" }}>
            <p className="text-xs font-semibold text-green-700 mb-2">🧪 Credenciales de prueba:</p>
            <p className="text-xs text-green-800 font-mono">demo@menuexpress.com</p>
            <p className="text-xs text-green-800 font-mono mb-2">demo1234</p>
            <button
              type="button"
              onClick={fillDemo}
              className="text-xs font-semibold underline"
              style={{ color: "var(--primary)" }}
            >
              Completar automáticamente
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.4)" }}>
          Auth simulada · Se conectará a Supabase en producción
        </p>
      </div>
    </div>
  )
}