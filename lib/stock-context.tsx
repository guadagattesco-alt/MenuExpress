"use client"

import {
  createContext, useContext, useState, useEffect,
  useCallback, type ReactNode,
} from "react"
import type { Recipe } from "@/lib/recipes"

interface StockEntry { quantity: number; unit: string }
type Stock = Record<string, StockEntry>

interface StockContextValue {
  myStock: Stock
  stockCount: number
  hydrated: boolean
  addIngredient: (name: string, qty: number, unit: string) => void
  removeIngredient: (name: string) => void
  adjustIngredient: (name: string, delta: number) => void
  cookRecipe: (recipe: Recipe) => void
}

const STORAGE_KEY = "menuexpress-stock"

const DEFAULT_STOCK: Stock = {
  "Huevo":            { quantity: 8,   unit: "u"  },
  "Arroz":            { quantity: 500, unit: "g"  },
  "Atún en lata":     { quantity: 3,   unit: "u"  },
  "Aceite":           { quantity: 300, unit: "ml" },
  "Aceite de oliva":  { quantity: 200, unit: "ml" },
  "Cebolla":          { quantity: 4,   unit: "u"  },
  "Papa":             { quantity: 600, unit: "g"  },
  "Ajo":              { quantity: 6,   unit: "u"  },
  "Fideos":           { quantity: 500, unit: "g"  },
  "Tomate triturado": { quantity: 400, unit: "g"  },
  "Pechuga de pollo": { quantity: 600, unit: "g"  },
  "Limón":            { quantity: 3,   unit: "u"  },
  "Tomate":           { quantity: 4,   unit: "u"  },
  "Lechuga":          { quantity: 200, unit: "g"  },
  "Zanahoria":        { quantity: 3,   unit: "u"  },
  "Pan rallado":      { quantity: 200, unit: "g"  },
  "Queso cremoso":    { quantity: 150, unit: "g"  },
  "Manteca":          { quantity: 100, unit: "g"  },
  "Espinaca":         { quantity: 200, unit: "g"  },
  "Salsa de soja":    { quantity: 100, unit: "ml" },
}

const StockContext = createContext<StockContextValue | null>(null)

export function StockProvider({ children }: { children: ReactNode }) {
  const [myStock, setMyStock] = useState<Stock>(DEFAULT_STOCK)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setMyStock(JSON.parse(raw))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  const persist = useCallback((s: Stock) => {
    setMyStock(s)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch { /* ignore */ }
  }, [])

  const addIngredient = (name: string, qty: number, unit: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const next = { ...myStock }
    if (next[trimmed]) next[trimmed] = { ...next[trimmed], quantity: next[trimmed].quantity + qty }
    else next[trimmed] = { quantity: qty, unit }
    persist(next)
  }

  const removeIngredient = (name: string) => {
    const next = { ...myStock }
    delete next[name]
    persist(next)
  }

  const adjustIngredient = (name: string, delta: number) => {
    if (!myStock[name]) return
    const next = { ...myStock }
    const newQty = next[name].quantity + delta
    if (newQty <= 0) delete next[name]
    else next[name] = { ...next[name], quantity: newQty }
    persist(next)
  }

  const cookRecipe = (recipe: Recipe) => {
    const next = { ...myStock }
    for (const ing of recipe.ingredients) {
      if (next[ing.item]) {
        const newQty = next[ing.item].quantity - ing.quantity
        if (newQty <= 0) delete next[ing.item]
        else next[ing.item] = { ...next[ing.item], quantity: newQty }
      }
    }
    persist(next)
  }

  return (
    <StockContext.Provider value={{
      myStock, hydrated,
      stockCount: Object.keys(myStock).length,
      addIngredient, removeIngredient, adjustIngredient, cookRecipe,
    }}>
      {children}
    </StockContext.Provider>
  )
}

export function useStock() {
  const ctx = useContext(StockContext)
  if (!ctx) throw new Error("useStock debe usarse dentro de StockProvider")
  return ctx
}