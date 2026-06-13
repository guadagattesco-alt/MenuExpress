"use client"

import { useState, useEffect, useRef } from "react"
import { StockProvider } from "@/lib/stock-context"
import { ToastProvider } from "@/lib/toast-context"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Header, type TabId } from "@/components/header"
import { PlanTab } from "@/components/plan-tab"
import { FridgeTab } from "@/components/fridge-tab"
import { SalvavidasTab } from "@/components/salvavidas-tab"
import { LoginScreen } from "@/components/login-screen"
import { Footer } from "@/components/footer"
import type { PlanEntry } from "@/lib/planner"
import type { RecipeCategory, Recipe } from "@/lib/recipes"

export interface PlanState {
  plan: PlanEntry[] | null
  days: number
  objective: RecipeCategory
  boughtItems: string[]
}

export interface SalvavidasState {
  results: { recipe: Recipe; pct: number; missing: string[] }[] | null
}

function AppShell() {
  const { user, logout, hydrated } = useAuth()
  const [tab, setTab] = useState<TabId>("plan")

// Recordar la última pestaña activa
useEffect(() => {
  try {
    const saved = localStorage.getItem("menuexpress-tab") as TabId | null
    if (saved) setTab(saved)
  } catch { /* ignore */ }
}, [])

useEffect(() => {
  try { localStorage.setItem("menuexpress-tab", tab) } catch { /* ignore */ }
}, [tab])

const [planState, setPlanState] = useState<PlanState>({
    plan: null, days: 3, objective: "saludable", boughtItems: [],
  })
  const skipNextShoppingSave = useRef(false)

  // Cargar el plan guardado al loguearse
  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/plan?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.plan) {
          setPlanState(prev => ({ ...prev, plan: data.plan, days: data.days, objective: data.objective }))
        }
      })
      .catch(() => {})
  }, [user])

  // Guardar el plan cada vez que cambia
  useEffect(() => {
    if (!user?.id || !planState.plan) return
    fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        days: planState.days,
        objective: planState.objective,
        plan: planState.plan,
      })
    }).catch(() => {})
  }, [planState.plan])

  // Cargar la lista de compras guardada al loguearse
  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/shopping?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.boughtItems) && data.boughtItems.length > 0) {
          skipNextShoppingSave.current = true
          setPlanState(prev => ({ ...prev, boughtItems: data.boughtItems }))
        }
      })
      .catch(() => {})
  }, [user])

  // Guardar la lista de compras cada vez que cambia
  useEffect(() => {
    if (!user?.id) return
    if (skipNextShoppingSave.current) { skipNextShoppingSave.current = false; return }
    fetch('/api/shopping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, boughtItems: planState.boughtItems })
    }).catch(() => {})
  }, [planState.boughtItems, user])

  const [salvavidasState, setSalvavidasState] = useState<SalvavidasState>({
    results: null,
  })

  if (!hydrated) return null
  if (!user) return <LoginScreen />

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header active={tab} onChange={setTab} onLogout={logout} />

      {/* Plan tab: hero full-bleed, contenido con padding */}
      <div className="flex-1 flex flex-col" style={{ display: tab === "plan" ? "flex" : "none" }}>
        <PlanTab state={planState} onStateChange={setPlanState} />
      </div>

      {/* Fridge + Salvavidas con padding normal */}
      {tab !== "plan" && (
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 max-w-screen-2xl mx-auto">
          <div style={{ display: tab === "fridge" ? "block" : "none" }}>
            <FridgeTab />
          </div>
          <div style={{ display: tab === "salvavidas" ? "block" : "none" }}>
            <SalvavidasTab state={salvavidasState} onStateChange={setSalvavidasState} />
          </div>
        </main>
      )}

      <Footer />
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <ToastProvider>
        <StockProvider>
          <AppShell />
        </StockProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
