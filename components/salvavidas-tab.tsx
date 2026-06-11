"use client"

import { useState } from "react"
import { Search, ShoppingCart, Plus, Check, Lock } from "lucide-react"
import { RecipeCard } from "@/components/recipe-card"
import { RECIPES_DB, type Recipe } from "@/lib/recipes"
import { useStock } from "@/lib/stock-context"
import { useToast } from "@/lib/toast-context"
import type { SalvavidasState } from "@/app/page"

interface MatchResult { recipe: Recipe; pct: number; missing: string[] }

interface Props {
  state: SalvavidasState
  onStateChange: (s: SalvavidasState) => void
}

export function SalvavidasTab({ state, onStateChange }: Props) {
  const { myStock, addIngredient } = useStock()
  const { showToast } = useToast()
  const results = state.results

  // Track "bought missing" per recipe
  const [boughtMissing, setBoughtMissing] = useState<Record<string, Set<string>>>({})

  const handleScan = () => {
    const matches: MatchResult[] = []
    for (const recipe of RECIPES_DB) {
      const missing: string[] = []
      let matched = 0
      for (const ing of recipe.ingredients) {
        const inStock = myStock[ing.item]
        if (inStock && inStock.quantity >= ing.quantity) matched++
        else missing.push(ing.item)
      }
      const pct = Math.round((matched / recipe.ingredients.length) * 100)
      if (pct >= 60) matches.push({ recipe, pct, missing })
    }
    matches.sort((a, b) => b.pct - a.pct)
    onStateChange({ results: matches })
    setBoughtMissing({})
  }

  const handleBuyMissing = (recipeId: string, ingName: string, quantity: number, unit: string) => {
    addIngredient(ingName, quantity, unit)
    setBoughtMissing(prev => {
      const next = { ...prev }
      next[recipeId] = new Set([...(prev[recipeId] ?? []), ingName])
      return next
    })
    showToast(`✅ ${ingName} agregado a tu heladera.`)
  }

  const handleBuyAllMissing = (recipe: Recipe, missing: string[]) => {
    const remaining = missing.filter(name => !(boughtMissing[recipe.id]?.has(name)))
    if (!remaining.length) return
    remaining.forEach(name => {
      const ing = recipe.ingredients.find(i => i.item === name)
      if (ing) addIngredient(ing.item, ing.quantity, ing.unit)
    })
    setBoughtMissing(prev => ({
      ...prev,
      [recipe.id]: new Set([...(prev[recipe.id] ?? []), ...remaining])
    }))
    showToast(`🛒 ${remaining.length} ingrediente${remaining.length !== 1 ? "s" : ""} agregado${remaining.length !== 1 ? "s" : ""} a tu heladera.`)
  }

  const isRecipeUnlocked = (recipe: Recipe, missing: string[]) =>
    missing.every(name => boughtMissing[recipe.id]?.has(name))

  const fullyReady = results?.filter(r => r.pct === 100) ?? []
  const partial    = results?.filter(r => r.pct < 100)   ?? []

  return (
    <div className="flex flex-col gap-8">

      {/* Page hero */}
      <div className="page-hero">
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Salvavidas 🚨
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)" }} className="text-sm max-w-sm">
              Escaneamos tu heladera y te decimos qué podés cocinar ahora mismo, sin ir al súper.
            </p>
            {results !== null && (
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="stat-pill" style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                  ✅ {fullyReady.length} listas ya
                </span>
                <span className="stat-pill" style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                  ⚡ {partial.length} casi listas
                </span>
              </div>
            )}
          </div>
          <button type="button" onClick={handleScan}
            className="btn-scan-pulse shrink-0 inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: "var(--warning)", color: "#1a3c2e" }}>
            <Search className="size-5" />
            {results === null ? "Escanear mi heladera" : "Volver a escanear"}
          </button>
        </div>
      </div>

      {/* Results */}
      {results !== null && (
        <div className="flex flex-col gap-10">
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-16 text-center">
              <span className="text-5xl">😔</span>
              <div>
                <p className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Stock insuficiente
                </p>
                <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                  No hay recetas con al menos 60% de ingredientes disponibles. Cargá más en tu heladera.
                </p>
              </div>
            </div>
          ) : (
            <>
              {fullyReady.length > 0 && (
                <section className="flex flex-col gap-4">
                  <div className="section-divider">
                    <span className="text-sm font-bold text-foreground whitespace-nowrap flex items-center gap-2">
                      ✅ <span>Listas para cocinar ahora</span>
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                        {fullyReady.length}
                      </span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {fullyReady.map(({ recipe, pct }) => (
                      <RecipeCard key={recipe.id} recipe={recipe} matchPct={pct} />
                    ))}
                  </div>
                </section>
              )}

              {partial.length > 0 && (
                <section className="flex flex-col gap-4">
                  <div className="section-divider">
                    <span className="text-sm font-bold text-foreground whitespace-nowrap flex items-center gap-2">
                      ⚡ <span>Casi listas — te falta poco</span>
                      <span className="rounded-full px-2.5 py-1 text-xs font-bold"
                        style={{ background: "#fff0d6", color: "#b37a00" }}>
                        {partial.length}
                      </span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {partial.map(({ recipe, pct, missing }) => {
                      const alreadyBought = boughtMissing[recipe.id] ?? new Set<string>()
                      const stillMissing  = missing.filter(n => !alreadyBought.has(n))
                      const unlocked      = isRecipeUnlocked(recipe, missing)

                      return (
                        <div key={recipe.id} className="flex flex-col gap-0 rounded-2xl border border-border overflow-hidden shadow-sm">
                          <RecipeCard
                            recipe={recipe}
                            matchPct={unlocked ? 100 : pct}
                            missing={unlocked ? undefined : stillMissing}
                            blocked={!unlocked}
                          />

                          {/* Missing ingredients panel */}
                          {!unlocked && stillMissing.length > 0 && (
                            <div className="border-t border-border bg-amber-50 p-4 flex flex-col gap-3">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                                  <ShoppingCart className="size-3.5" />
                                  Ingredientes faltantes
                                </p>
                                <button
                                  type="button"
                                  onClick={() => handleBuyAllMissing(recipe, stillMissing)}
                                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all hover:scale-105 active:scale-95"
                                  style={{ background: "var(--warning)", color: "#1a3c2e" }}>
                                  <Plus className="size-3" />
                                  Comprar todo
                                </button>
                              </div>

                              <ul className="flex flex-col gap-1">
                                {stillMissing.map(name => {
                                  const ing = recipe.ingredients.find(i => i.item === name)
                                  return (
                                    <li key={name} className="flex items-center gap-2">
                                      <span className="flex-1 text-xs text-amber-800">{name}</span>
                                      {ing && (
                                        <span className="text-xs text-amber-600 tabular-nums">
                                          {ing.quantity}{ing.unit}
                                        </span>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => ing && handleBuyMissing(recipe.id, name, ing.quantity, ing.unit)}
                                        className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold transition-all hover:scale-105"
                                        style={{ background: "#fff0d6", color: "#b37a00" }}>
                                        <Plus className="size-2.5" /> Comprado
                                      </button>
                                    </li>
                                  )
                                })}
                              </ul>

                              {/* Already bought */}
                              {alreadyBought.size > 0 && (
                                <ul className="flex flex-col gap-0.5">
                                  {[...alreadyBought].map(name => (
                                    <li key={name} className="flex items-center gap-2 opacity-60">
                                      <Check className="size-3 text-green-600 shrink-0" />
                                      <span className="text-xs text-green-700 line-through">{name}</span>
                                      <span className="text-xs text-green-600 font-semibold ml-auto">en heladera</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}

                          {/* Unlocked! */}
                          {unlocked && (
                            <div className="border-t border-green-200 bg-green-50 px-4 py-3 flex items-center gap-2">
                              <Check className="size-4 text-green-600" />
                              <p className="text-xs font-bold text-green-700">
                                ¡Tenés todo! Ya podés cocinar esta receta.
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}


