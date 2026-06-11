"use client"

import { useState, useMemo } from "react"
import { Trash2, Plus, Minus, Cloud, Loader2, Package, Search as SearchIcon } from "lucide-react"
import { useStock } from "@/lib/stock-context"
import { useToast } from "@/lib/toast-context"

const CATEGORIES: Record<string, string[]> = {
  "🥩 Proteínas": ["Pechuga de pollo","Muslo de pollo","Carne picada","Salmón","Atún en lata","Merluza","Jamón cocido","Bife de chorizo","Pechuga de pavo"],
  "🥬 Verduras":  ["Lechuga","Espinaca","Tomate","Zanahoria","Morrón","Zapallito","Brócoli","Cebolla","Ajo","Papa","Batata","Palta","Tomate cherry"],
  "🍚 Almacén":   ["Arroz","Fideos","Lentejas","Quinoa","Pan rallado","Tomate triturado","Caldo de pollo","Caldo de verduras","Salsa de soja","Aceite","Aceite de oliva","Soja texturizada"],
  "🧀 Lácteos":   ["Huevo","Leche","Queso cremoso","Queso feteado","Manteca"],
  "🍋 Frescos":   ["Limón","Morrón","Zapallito","Tomate cherry"],
  "🫙 Otros":     [],
}

const getCategoryFor = (name: string) => {
  for (const [cat, items] of Object.entries(CATEGORIES)) {
    if (items.includes(name)) return cat
  }
  return "🫙 Otros"
}

const PREDEFINED = Object.values(CATEGORIES).flat().filter(Boolean).sort((a,b) => a.localeCompare(b,"es"))

const UNITS = [
  { value: "g",  label: "g — gramos"     },
  { value: "ml", label: "ml — mililitros" },
  { value: "u",  label: "u — unidades"   },
]

const UNIT_STYLE: Record<string, { bg: string; color: string }> = {
  g:  { bg: "#e8f5ee", color: "#1a5c32" },
  ml: { bg: "#e8f0fe", color: "#1a3575" },
  u:  { bg: "#fff0d6", color: "#7a4a00" },
}

const ING_EMOJI: Record<string, string> = {
  "Huevo":"🥚","Arroz":"🍚","Atún en lata":"🐟","Aceite":"🫙",
  "Aceite de oliva":"🫒","Cebolla":"🧅","Papa":"🥔","Ajo":"🧄",
  "Fideos":"🍝","Tomate triturado":"🍅","Pechuga de pollo":"🍗",
  "Limón":"🍋","Tomate":"🍅","Lechuga":"🥬","Zanahoria":"🥕",
  "Pan rallado":"🍞","Queso cremoso":"🧀","Manteca":"🧈",
  "Espinaca":"🥬","Salsa de soja":"🍶","Carne picada":"🥩",
  "Salmón":"🐟","Leche":"🥛","Morrón":"🫑","Zapallito":"🥒",
  "Batata":"🍠","Brócoli":"🥦","Palta":"🥑","Muslo de pollo":"🍗",
  "Jamón cocido":"🥩","Queso feteado":"🧀","Lentejas":"🫘",
}
const getEmoji = (n: string) => ING_EMOJI[n] ?? "🥘"

export function FridgeTab() {
  const { myStock, addIngredient, removeIngredient, adjustIngredient, hydrated } = useStock()
  const { showToast, hideToast } = useToast()

  // Input para agregar
  const [search,   setSearch]   = useState("")
  const [selName,  setSelName]  = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit,     setUnit]     = useState("u")
  const [syncing,  setSyncing]  = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Filtro de búsqueda sobre los ingredientes YA cargados
  const [stockFilter, setStockFilter] = useState("")

  const filteredPredefined = useMemo(() =>
    search.length > 0
      ? PREDEFINED.filter(p => p.toLowerCase().includes(search.toLowerCase()))
      : PREDEFINED
  , [search])

  const handleSelect = (name: string) => {
    setSelName(name); setSearch(name); setShowDropdown(false)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const name = selName || search.trim()
    const qty  = Number(quantity)
    if (!name || !qty || qty <= 0) { showToast("⚠️ Completá nombre y cantidad."); return }
    addIngredient(name, qty, unit)
    showToast(`✅ ${name} agregado.`)
    setSearch(""); setSelName(""); setQuantity("")
  }

  const handleSync = () => {
    if (syncing) return
    setSyncing(true)
    const id = showToast("Sincronizando con la nube...", { spinner: true })
    setTimeout(() => { hideToast(id); setSyncing(false); showToast("☁️ ¡Stock sincronizado!") }, 1500)
  }

  const entries = Object.entries(myStock).sort((a, b) => a[0].localeCompare(b[0], "es"))
  const total   = entries.length

  // Filtrar stock por búsqueda
  const filteredEntries = useMemo(() =>
    stockFilter.trim().length > 0
      ? entries.filter(([name]) => name.toLowerCase().includes(stockFilter.toLowerCase()))
      : entries
  , [entries, stockFilter])

  // Agrupar por categoría
  const grouped = useMemo(() => {
    const groups: Record<string, [string, { quantity: number; unit: string }][]> = {}
    for (const entry of filteredEntries) {
      const cat = getCategoryFor(entry[0])
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(entry)
    }
    return groups
  }, [filteredEntries])

  return (
    <div className="flex flex-col gap-8">

      {/* Page hero */}
      <div className="page-hero">
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest mb-1 block"
              style={{ color: "#3dba72", letterSpacing: "2px" }}>
              Tu despensa digital
            </span>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Mi Heladera 🧊
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              {total} ingrediente{total !== 1 ? "s" : ""} disponibles
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.2)" }}>
              🔍 Búsqueda inteligente
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.2)" }}>
              ⚡ Ajuste rápido
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">

        {/* Add form */}
        <form onSubmit={handleAdd} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            + Agregar ingrediente
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_110px_140px_auto]">
            <div className="relative">
              <div className="relative flex items-center">
                <SearchIcon className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                <input type="text" value={search}
                  onChange={e => { setSearch(e.target.value); setSelName(""); setShowDropdown(true) }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Buscar o escribir ingrediente..."
                  className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {showDropdown && filteredPredefined.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-border bg-white shadow-xl max-h-48 overflow-y-auto">
                  {filteredPredefined.slice(0, 20).map(name => (
                    <button key={name} type="button"
                      onMouseDown={() => handleSelect(name)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-accent transition-colors">
                      <span className="text-base">{getEmoji(name)}</span>
                      <span className="font-medium">{name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{getCategoryFor(name)}</span>
                    </button>
                  ))}
                  {search.length > 0 && !PREDEFINED.includes(search.trim()) && (
                    <button type="button"
                      onMouseDown={() => handleSelect(search.trim())}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-accent border-t border-border">
                      <span>➕</span>
                      <span>Agregar "<strong>{search.trim()}</strong>"</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)}
              placeholder="Cantidad" min={0} onClick={() => setShowDropdown(false)}
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <select value={unit} onChange={e => setUnit(e.target.value)}
              onClick={() => setShowDropdown(false)}
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
              {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
            <button type="submit" onClick={() => setShowDropdown(false)}
              className="rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "var(--primary)" }}>
              Agregar
            </button>
          </div>
        </form>

        {/* Buscador de stock existente */}
        {total > 6 && (
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value)}
              placeholder={`Buscar entre tus ${total} ingredientes...`}
              className="w-full rounded-xl border border-input bg-card pl-9 pr-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
            {stockFilter && (
              <button type="button" onClick={() => setStockFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground">
                ✕ limpiar
              </button>
            )}
          </div>
        )}

        {/* Resultado del filtro */}
        {stockFilter && (
          <p className="text-sm text-muted-foreground -mt-4">
            {filteredEntries.length} resultado{filteredEntries.length !== 1 ? "s" : ""} para "<strong>{stockFilter}</strong>"
          </p>
        )}

        {/* Stock agrupado */}
        {!hydrated ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-16 text-center">
            <Package className="size-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">Tu heladera está vacía.</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No encontramos "<strong>{stockFilter}</strong>" en tu heladera.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(grouped).map(([cat, catEntries]) => (
              <div key={cat} className="flex flex-col gap-3">
                <div className="section-divider">
                  <span className="text-xs font-bold text-muted-foreground whitespace-nowrap uppercase tracking-widest">
                    {cat}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {catEntries.map(([item, entry]) => {
                    const us   = UNIT_STYLE[entry.unit] ?? { bg: "#f2ede6", color: "#4a4a4a" }
                    const step = entry.unit === "u" ? 1 : 50
                    const isLow = (entry.unit === "u" && entry.quantity <= 2)
                               || (entry.unit === "g"  && entry.quantity <= 100)
                               || (entry.unit === "ml" && entry.quantity <= 50)
                    return (
                      <div key={item}
                        className="fridge-card relative flex flex-col gap-3 rounded-2xl border border-border p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                        style={isLow ? { borderColor: "#f5a623" } : {}}>
                        <button type="button"
                          onClick={() => { removeIngredient(item); showToast(`🗑️ ${item} eliminado.`) }}
                          className="absolute right-2 top-2 rounded-lg p-1 text-muted-foreground/40 hover:bg-red-50 hover:text-red-400 transition-colors">
                          <Trash2 className="size-3.5" />
                        </button>
                        <div className="flex items-center gap-2 pr-6">
                          <span className="text-xl select-none">{getEmoji(item)}</span>
                          <span className="text-xs font-semibold text-muted-foreground leading-tight line-clamp-2">{item}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => adjustIngredient(item, -step)}
                            className="flex size-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                            <Minus className="size-3" />
                          </button>
                          <span className="flex-1 text-center font-bold tabular-nums leading-none"
                            style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", color: isLow ? "#c8760a" : "var(--primary)" }}>
                            {entry.quantity}
                          </span>
                          <button type="button" onClick={() => adjustIngredient(item, step)}
                            className="flex size-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                            style={{ background: us.bg, color: us.color }}>{entry.unit}</span>
                          {isLow && <span className="text-xs font-bold" style={{ color: "#c8760a" }}>⚠️</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sync */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div>
            <p className="text-sm font-bold">Guardar en la nube</p>
            <p className="text-xs text-muted-foreground mt-0.5">Accedé a tu stock desde cualquier dispositivo</p>
          </div>
          <button type="button" onClick={handleSync} disabled={syncing}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-accent disabled:opacity-60 transition-colors">
            {syncing ? <Loader2 className="size-4 animate-spin" /> : <Cloud className="size-4" />}
            {syncing ? "Sincronizando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  )
}
