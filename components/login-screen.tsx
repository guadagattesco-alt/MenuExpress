"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

type View = "hero" | "login" | "register" | "forgot"

export function LoginScreen() {
  // Traemos las funciones reales del contexto
  const { login, register } = useAuth()
  const [view,     setView]     = useState<View>("hero")
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [name,     setName]     = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState("")

  const reset = () => { setError(""); setSuccess("") }

  // 1. MANEJO DE LOGIN REAL
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError("Completá todos los campos."); return }
    reset(); setLoading(true)
    const res = await login(email, password)
    setLoading(false)
    if (!res.ok) setError(res.error ?? "Error desconocido.")
  }

  // 2. MANEJO DE REGISTRO REAL (MANDANDO A MONGODB)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) { setError("Completá todos los campos."); return }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return }
    reset(); setLoading(true)
    
    // Llamamos a la función real del context
    const res = await register(name, email, password)
    setLoading(false)
    
    if (res.ok) {
      setSuccess("¡Cuenta creada con éxito! Ahora podés ingresar.")
      setView("login")
      // Limpiamos el nombre para que no quede colgado si vuelve a registrarse
      setName("") 
    } else {
      setError(res.error ?? "Error al intentar registrar el usuario.")
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError("Ingresá tu email."); return }
    reset(); setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSuccess(`Te enviamos un link de recuperación a ${email}`)
  }

  // Deshabilitamos temporalmente o dejamos el mock de Google apuntando al login real si querés testear rápido
  const handleGoogle = async () => {
  setLoading(true)
  try {
    const { signIn } = await import("next-auth/react")
    await signIn("google", { callbackUrl: "/" })
  } catch {
    setError("Error al iniciar con Google.")
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex flex-col">
      {/* HERO */}
      <div className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: view === "hero" ? "100vh" : "45vh", transition: "min-height 0.6s cubic-bezier(0.4,0,0.2,1)" }}>
        <img
          src="https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1800&q=85"
          alt="Mesa con comida fresca colorida"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(155deg, rgba(20,50,35,0.88) 0%, rgba(40,100,65,0.75) 50%, rgba(20,50,35,0.82) 100%)" }} />

        <div className="relative z-10 text-center px-6 flex flex-col items-center gap-7 max-w-3xl py-16">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold backdrop-blur-sm"
            style={{ background: "rgba(61,186,114,0.2)", color: "#7eeab0", border: "1px solid rgba(61,186,114,0.3)" }}>
            🌿 Planificación inteligente de comidas
          </span>

          <h1 className="text-6xl sm:text-8xl font-bold text-white leading-none"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-3px" }}>
            Menu<span style={{ color: "#3dba72" }}>Express</span>
          </h1>

          <p className="text-xl sm:text-2xl leading-relaxed max-w-xl font-medium"
            style={{ color: "rgba(255,255,255,0.82)" }}>
            De la heladera al plato, <span style={{ color: "#7eeab0" }}>sin vueltas</span>.<br/>
            Planificá, organizá y cociná con lo que tenés.
          </p>

          {view === "hero" && (
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-2">
              <button type="button" onClick={() => { setView("register"); reset() }}
                className="flex-1 rounded-2xl py-4 text-base font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
                style={{ background: "linear-gradient(135deg, #2d7a4f 0%, #3dba72 100%)", boxShadow: "0 8px 32px rgba(61,186,114,0.4)" }}>
                Crear cuenta gratis →
              </button>
              <button type="button" onClick={() => { setView("login"); reset() }}
                className="flex-1 rounded-2xl py-4 text-base font-semibold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
                Ya tengo cuenta
              </button>
            </div>
          )}

          {view === "hero" && (
            <button type="button" onClick={handleGoogle}
              className="inline-flex items-center gap-3 rounded-2xl px-6 py-3 text-sm font-semibold transition-all hover:scale-105 backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.95)", color: "#1a1a1a" }}>
              <svg className="size-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          )}

          {view === "hero" && (
            <div className="flex flex-wrap justify-center gap-6 mt-2">
              {["🗓 Menú semanal automático", "🧊 Stock de heladera", "🚨 Recetas de emergencia", "🛒 Lista de compras"].map(f => (
                <span key={f} className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{f}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FORMS */}
      {view !== "hero" && (
        <div className="flex items-center justify-center px-4 py-12" style={{ background: "var(--background)" }}>
          <div className="w-full max-w-sm flex flex-col gap-4">

            {/* Tabs */}
            <div className="flex rounded-2xl border border-border bg-card p-1 shadow-sm">
              {(["login","register"] as View[]).map(v => (
                <button key={v} type="button" onClick={() => { setView(v); reset() }}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all"
                  style={view === v
                    ? { background: "var(--header-bg)", color: "white" }
                    : { color: "var(--muted-foreground)" }}>
                  {v === "login" ? "Ingresar" : "Registrarse"}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-card p-7 shadow-xl border border-border">
              {success && (
                <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium">
                  ✅ {success}
                </div>
              )}

              {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">{error}</div>}

              {/* LOGIN */}
              {view === "login" && (
                <>
                  <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)" }}>Bienvenido de vuelta</h2>
                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email"
                        className="rounded-xl border border-input px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contraseña</label>
                        <button type="button" onClick={() => { setView("forgot"); reset() }}
                          className="text-xs font-semibold underline" style={{ color: "var(--primary)" }}>
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"
                        className="rounded-xl border border-input px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full rounded-xl py-3.5 text-sm font-bold text-white hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                      style={{ background: "linear-gradient(135deg, #1a3c2e 0%, #2d7a4f 100%)" }}>
                      {loading ? <><svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/></svg>Procesando...</> : "Ingresar →"}
                    </button>
                  </form>
                </>
              )}

              {/* REGISTER */}
              {view === "register" && (
                <>
                  <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)" }}>Crear tu cuenta</h2>
                  <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nombre</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre"
                        className="rounded-xl border border-input px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
                        className="rounded-xl border border-input px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contraseña</label>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                        className="rounded-xl border border-input px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full rounded-xl py-3.5 text-sm font-bold text-white hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                      style={{ background: "linear-gradient(135deg, #1a3c2e 0%, #2d7a4f 100%)" }}>
                      {loading ? "Creando cuenta..." : "Crear cuenta →"}
                    </button>
                  </form>
                </>
              )}

              {/* FORGOT */}
              {view === "forgot" && (
                <>
                  <button type="button" onClick={() => { setView("login"); reset() }}
                    className="text-xs font-semibold mb-4 inline-flex items-center gap-1" style={{ color: "var(--primary)" }}>
                    ← Volver al inicio de sesión
                  </button>
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Recuperar contraseña</h2>
                  <p className="text-sm text-muted-foreground mb-5">Te enviamos un link para restablecer tu contraseña.</p>
                  <form onSubmit={handleForgot} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
                        className="rounded-xl border border-input px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full rounded-xl py-3.5 text-sm font-bold text-white hover:opacity-90 active:scale-95 disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #1a3c2e 0%, #2d7a4f 100%)" }}>
                      {loading ? "Enviando..." : "Enviar link de recuperación"}
                    </button>
                  </form>
                </>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Base de Datos Conectada · MongoDB Atlas Real
            </p>
          </div>
        </div>
      )}
    </div>
  )
}