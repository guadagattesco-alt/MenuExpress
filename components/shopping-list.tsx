"use client"

import { useMemo, useState } from "react"
import { ShoppingCart, Copy, Check, Plus, PackageCheck } from "lucide-react"
import { CATEGORY_LABELS, type RecipeCategory } from "@/lib/recipes"
import { buildShoppingList, type PlanEntry } from "@/lib/planner"
import { useStock } from "@/lib/stock-context"
import { useToast } from "@/lib/toast-context"

interface ShoppingListProps {
  plan: PlanEntry[]
  days: number
  objective: RecipeCategory
}

interface ShoppingItem {
  item: string
  quantity: number
  unit: string
  durability: string
  section: "almacen" | "fresco"
}

export function ShoppingList({ plan, days, objective }: ShoppingListProps) {
  const { almacen, fresco } = useMemo(() => buildShoppingList(plan), [plan])
  const { addIngredient } = useStock()
  const { showToast } = useToast()

  const [bought,  setBought]  = useState<Record<string, boolean>>({})
  const [copied,  setCopied]  = useState(false)

  const allItems: ShoppingItem[] = useMemo(() => [
    ...almacen.map(i => ({ ...i, section: "almacen" as const })),
    ...fresco.map(i  => ({ ...i, section: "fresco"  as const })),
  ], [almacen, fresco])

  const handleBought = (item: ShoppingItem) => {
    const key = `${item.section}-${item.item}`
    if (bought[key]) return
    setBought(p => ({ ...p, [key]: true }))
    addIngredient(item.item, item.quantity, item.unit)
    showToast(`✅ ${item.item} agregado a tu heladera.`)
  }

  const handleBuyAll = () => {
    const pending = allItems.filter(i => !bought[`${i.section}-${i.item}`])
    if (!pending.length) return
    const next = { ...bought }
    pending.forEach(i => {
      next[`${i.section}-${i.item}`] = true
      addIngredient(i.item, i.quantity, i.unit)
    })
    setBought(next)
    showToast(`🛒 ¡${pending.length} ingredientes agregados a tu heladera!`)
  }

  const boughtCount  = Object.values(bought).filter(Boolean).length
  const pendingCount = allItems.length - boughtCount
  const allDone      = pendingCount === 0

  const whatsappText = useMemo(() => {
    const objLabel = CATEGORY_LABELS[objective].replace(/^[^\s]+\s/, "")
    const bk = new Set(Object.keys(bought).filter(k => bought[k]))
    const pa = almacen.filter(i => !bk.has(`almacen-${i.item}`))
    const pf = fresco.filter(i  => !bk.has(`fresco-${i.item}`))
    return [
      `🛒 *Lista de compras MenuExpress*`,
      `📅 Plan: ${days} día${days > 1 ? "s" : ""} — ${objLabel}`,
      "", "📦 *ALMACÉN / CONGELAR*",
      ...pa.map(i => `• ${i.item}: ${i.quantity}${i.unit}`),
      "", "🥬 *FRESCOS DEL DÍA*",
      ...pf.map(i => `• ${i.item}: ${i.quantity}${i.unit}`),
      "", "✅ Generado con MenuExpress",
    ].join("\n")
  }, [almacen, fresco, days, objective, bought])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(whatsappText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const renderSection = (
    title: string, emoji: string,
    items: typeof almacen,
    sectionKey: "almacen" | "fresco",
    accentColor: string
  ) => {
    const pending = items.filter(i => !bought[`${sectionKey}-${i.item}`])
    const done    = items.filter(i =>  bought[`${sectionKey}-${i.item}`])
    if (items.length === 0) return null
    return (
      <div className="flex flex-col gap-1">
        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest py-1"
          style={{ color: accentColor }}>
          {emoji} {title}
          {pending.length === 0 && (
            <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">✓</span>
          )}
        </h3>
        <ul className="flex flex-col">
          {pending.map(i => (
            <li key={i.item}>
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent transition-colors">
                <span className="flex-1 text-sm text-foreground">{i.item}</span>
                <span className="tabular-nums text-xs font-semibold text-muted-foreground">
                  {i.quantity}{i.unit}
                </span>
                <button type="button"
                  onClick={() => handleBought({ ...i, section: sectionKey })}
                  className="shrink-0 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold transition-all hover:scale-105 active:scale-95"
                  style={{ background: "var(--accent)", color: "var(--primary)" }}>
                  <Plus className="size-3" /> Comprado
                </button>
              </div>
            </li>
          ))}
          {done.map(i => (
            <li key={`d-${i.item}`}>
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 opacity-40">
                <Check className="size-3.5 text-green-500 shrink-0" />
                <span className="flex-1 text-sm line-through text-muted-foreground">{i.item}</span>
                <span className="text-xs text-green-600 font-semibold">✓</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    /*
      La lista usa overflow-y: auto con maxHeight heredado del padre (calc(100vh - 5rem))
      Si el contenido es corto → no scrollea, ocupa lo que necesita
      Si el contenido es largo → scrollea internamente
    */
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm overflow-y-auto h-fit"
      style={{ maxHeight: "inherit" }}>

      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <div className="flex size-9 items-center justify-center rounded-xl shrink-0"
          style={{ background: "var(--accent)" }}>
          <ShoppingCart className="size-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Lista de compras
          </h2>
          <p className="text-xs text-muted-foreground">
            {allDone
              ? "¡Todo comprado! 🎉"
              : `${pendingCount} pendiente${pendingCount !== 1 ? "s" : ""}`}
            {boughtCount > 0 && ` · ${boughtCount} en heladera`}
          </p>
        </div>
      </div>

      {/* Comprar todo */}
      {!allDone && pendingCount > 1 && (
        <button type="button" onClick={handleBuyAll}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg, #1a3c2e 0%, #2d7a4f 100%)" }}>
          <PackageCheck className="size-4" />
          Compré todo
        </button>
      )}
      {allDone && (
        <div className="rounded-xl p-3 text-center text-sm font-semibold text-green-700"
          style={{ background: "#f0faf4", border: "1px solid #a8dfc0" }}>
          🎉 ¡Todo en tu heladera!
        </div>
      )}

      {renderSection("Almacén / Congelar", "📦", almacen, "almacen", "#b37a00")}
      {renderSection("Frescos del día",    "🥬", fresco,  "fresco",  "var(--primary)")}

      {/* WhatsApp */}
      <div className="rounded-xl p-4 flex flex-col gap-3 mt-1"
        style={{ background: "#f0faf4", border: "1px solid #a8dfc0" }}>
        <p className="text-xs font-bold text-green-700">📲 Compartir por WhatsApp</p>
        <pre className="text-xs text-green-800 whitespace-pre-wrap font-mono leading-relaxed max-h-24 overflow-y-auto">
          {whatsappText}
        </pre>
        <button type="button" onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-all active:scale-95"
          style={{ background: copied ? "var(--primary)" : "var(--header-bg)" }}>
          {copied
            ? <><Check className="size-4" /> ¡Copiado!</>
            : <><Copy className="size-4" /> Copiar texto</>}
        </button>
      </div>
    </div>
  )
}
