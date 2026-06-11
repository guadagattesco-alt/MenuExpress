"use client"

import { useState } from "react"
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
}

export interface SalvavidasState {
  results: { recipe: Recipe; pct: number; missing: string[] }[] | null
}

function AppShell() {
  const { user, logout, hydrated } = useAuth()
  const [tab, setTab] = useState<TabId>("plan")

  const [planState, setPlanState] = useState<PlanState>({
    plan: null, days: 3, objective: "saludable",
  })
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
