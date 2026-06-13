"use client"

import { Sparkles } from "lucide-react"
import { RecipeCard } from "@/components/recipe-card"
import { ShoppingList } from "@/components/shopping-list"
import { generatePlan } from "@/lib/planner"
import type { RecipeCategory } from "@/lib/recipes"
import type { PlanState } from "@/app/page"



const DURATIONS = [
  { value: 1, label: "1 día",   sub: "Ideal para hoy"  },
  { value: 3, label: "3 días",  sub: "Escapada corta"  },
  { value: 7, label: "Semanal", sub: "Toda la semana"  },
]

const OBJECTIVES: { value: RecipeCategory; label: string; sub: string }[] = [
  { value: "saludable", label: "🥗 Saludable", sub: "Liviano y nutritivo"  },
  { value: "economico", label: "💰 Económico", sub: "Rendidor y accesible" },
  { value: "proteico",  label: "💪 Proteico",  sub: "Para entrenar fuerte" },
]

interface PlanTabProps {
  state: PlanState
  onStateChange: (s: PlanState) => void
}

export function PlanTab({ state, onStateChange }: PlanTabProps) {
  const { plan, days, objective } = state

  const setDays      = (d: number)         => onStateChange({ ...state, days: d })
  const setObjective = (o: RecipeCategory) => onStateChange({ ...state, objective: o })
  const handleGenerate = () =>
  onStateChange({ ...state, plan: generatePlan(days, objective), boughtItems: [] })
  const handleMarkCooked = (day: number, mealType: "almuerzo" | "cena") => {
  if (!plan) return
  const updated = plan.map(entry => {
    if (entry.day !== day) return entry
    return mealType === "almuerzo"
      ? { ...entry, cookedLunch: true }
      : { ...entry, cookedDinner: true }
  })
  onStateChange({ ...state, plan: updated })
}

  return (
    <div className="flex flex-col flex-1">

      {/* HERO — full bleed */}
      <div className="page-hero">
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#3dba72", letterSpacing: "2px" }}>
              Tu planificador gastronómico
            </span>
            <h1 className="leading-none text-white"
              style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, letterSpacing: "-2px" }}>
              Comé bien,{" "}
              <em style={{ color: "#3dba72", fontStyle: "italic" }}>sin complicarte.</em>
            </h1>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "1.5px" }}>
                Duración
              </span>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map(d => (
                  <button key={d.value} type="button" onClick={() => setDays(d.value)}
                    className="flex flex-col items-start px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                    style={days === d.value
                      ? { background: "#fff", color: "#1a3c2e" }
                      : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(255,255,255,0.2)" }}>
                    <span className="font-bold">{d.label}</span>
                    <span className="text-xs" style={{ opacity: .65 }}>{d.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "1.5px" }}>
                Objetivo
              </span>
              <div className="flex flex-wrap gap-2">
                {OBJECTIVES.map(o => (
                  <button key={o.value} type="button" onClick={() => setObjective(o.value)}
                    className="flex flex-col items-start px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                    style={objective === o.value
                      ? { background: "var(--warning)", color: "#1a3c2e" }
                      : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(255,255,255,0.2)" }}>
                    <span className="font-bold">{o.label}</span>
                    <span className="text-xs" style={{ opacity: .65 }}>{o.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="button" onClick={handleGenerate}
            className="self-start inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: "var(--warning)", color: "#1a3c2e", fontFamily: "var(--font-heading)", letterSpacing: "-0.3px", boxShadow: "0 8px 28px rgba(245,166,35,0.35)" }}>
            <Sparkles className="size-5" />
            Generar mi plan
          </button>
        </div>
      </div>

      {/* RESULTS */}
      {plan && plan.length > 0 && (
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {/*
            Layout: recetas (izq) + lista de compras (der, sticky)
            - Las recetas fluyen normalmente con la página
            - La lista es sticky y scrollea independiente SOLO si su contenido
              es más alto que el viewport disponible (overflow-y: auto lo maneja solo)
          */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]" style={{ alignItems: "start" }}>

            {/* Recetas — fluyen con la página, sin maxHeight */}
            <div className="flex flex-col gap-8">
              {plan.map(entry => (
                <div key={entry.day} className="flex flex-col gap-4">
                  <div className="section-divider">
                    <span className="text-xs font-bold whitespace-nowrap uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-sans)", color: "var(--muted-foreground)" }}>
                      — Día {entry.day}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <RecipeCard
                      recipe={entry.lunch} day={entry.day}
                      cooked={entry.cookedLunch}
                      onCooked={() => handleMarkCooked(entry.day, "almuerzo")}
                    />
                    <RecipeCard
                      recipe={entry.dinner} day={entry.day}
                      cooked={entry.cookedDinner}
                      onCooked={() => handleMarkCooked(entry.day, "cena")}
                    />  
                  </div>
                </div>
              ))}
            </div>

            {/*
              Lista de compras: sticky, altura máxima = viewport - header (~80px)
              Si la lista es corta, ocupa lo que necesita y no genera hueco
              Si es larga, scrollea internamente sin mover la página
            */}
            <div className="lg:sticky lg:top-20" style={{ maxHeight: "calc(100vh - 5rem)" }}>
              <ShoppingList 
                plan={plan} 
                days={days} 
                objective={objective}
                boughtItems={state.boughtItems}
                onBoughtChange={(items) => onStateChange({ ...state, boughtItems: items })}
              />
            </div>
          </div>
        </div>
      )}

      {plan && plan.length === 0 && (
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 flex-1">
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No hay recetas para este objetivo.</p>
          </div>
        </div>
      )}
    </div>
  )
}


