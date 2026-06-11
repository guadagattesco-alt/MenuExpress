"use client"

import { Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { CATEGORY_LABELS, type Recipe } from "@/lib/recipes"
import { useStock } from "@/lib/stock-context"
import { useToast } from "@/lib/toast-context"

interface RecipeCardProps {
  recipe: Recipe
  day?: number
  matchPct?: number
  missing?: string[]
  blocked?: boolean  // si true, botón deshabilitado
}

const TYPE_LABEL: Record<Recipe["type"], string> = {
  almuerzo: "☀️ Almuerzo",
  cena: "🌙 Cena",
}

const RECIPE_IMAGES: Record<string, string> = {
  r01: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  r02: "https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=600&q=80",
  r03: "https://images.unsplash.com/photo-1512058454905-6b841e7ad132?w=600&q=80",
  r04: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80",
  r05: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
  r06: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
  r07: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  r08: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  r09: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  r10: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
  r11: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
  r12: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  r13: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80",
  r14: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
  r15: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
  r16: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  r17: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=600&q=80",
  r18: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&q=80",
  r19: "https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=600&q=80",
  r20: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80",
  r21: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  r22: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=600&q=80",
  r23: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=600&q=80",
  r24: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
}

export function RecipeCard({ recipe, day, matchPct, missing, blocked }: RecipeCardProps) {
  const { cookRecipe } = useStock()
  const { showToast } = useToast()

  const isFullMatch   = matchPct === 100
  const isPartialMatch = matchPct !== undefined && matchPct < 100
  const isAlmuerzo    = recipe.type === "almuerzo"
  const isBlocked     = blocked || (missing && missing.length > 0)
  const imgSrc        = RECIPE_IMAGES[recipe.id] ?? "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"

  const handleCook = () => {
    if (isBlocked) return
    cookRecipe(recipe)
    showToast(`🍽️ ¡A cocinar "${recipe.name}"! Stock actualizado.`)
  }

  return (
    <article className={cn(
      "flex flex-col rounded-2xl border bg-card shadow-sm overflow-hidden transition-all duration-300",
      isBlocked
        ? "border-amber-200 opacity-80 hover:opacity-100"
        : "border-border hover:shadow-xl hover:-translate-y-1.5"
    )}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={imgSrc} alt={recipe.name}
          className={cn("h-full w-full object-cover transition-transform duration-700",
            !isBlocked && "hover:scale-110",
            isBlocked && "grayscale-[30%]")}
          loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {day !== undefined && (
            <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white border border-white/20">
              Día {day}
            </span>
          )}
          <span className="rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-md border border-white/20"
            style={isAlmuerzo
              ? { background: "rgba(45,122,79,0.9)", color: "#fff" }
              : { background: "rgba(200,118,10,0.9)", color: "#fff" }}>
            {TYPE_LABEL[recipe.type]}
          </span>
          <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white border border-white/20">
            {CATEGORY_LABELS[recipe.category]}
          </span>
        </div>

        {isFullMatch && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
            <Check className="size-3" /> Listo
          </span>
        )}
        {isPartialMatch && (
          <span className="absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-bold shadow-lg"
            style={{ background: "#f5a623", color: "#1a3c2e" }}>
            ⚡ {matchPct}%
          </span>
        )}
        {isBlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl px-4 py-2 backdrop-blur-md flex items-center gap-2"
              style={{ background: "rgba(0,0,0,0.5)" }}>
              <Lock className="size-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Ingredientes incompletos</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-lg font-bold leading-tight text-card-foreground"
          style={{ fontFamily: "var(--font-heading)" }}>
          {recipe.name}
        </h3>

        <ul className="flex flex-col divide-y divide-border/50 text-sm flex-1">
          {recipe.ingredients.map((ing) => {
            const isMissing = missing?.includes(ing.item)
            return (
              <li key={ing.item}
                className="flex items-center justify-between gap-2 py-1.5">
                <span className={cn(isMissing ? "font-semibold" : "text-muted-foreground")}
                  style={isMissing ? { color: "var(--cena-accent)" } : {}}>
                  {isMissing ? "❌ " : "✓ "}{ing.item}
                </span>
                <span className="tabular-nums text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                  {ing.quantity}{ing.unit}
                </span>
              </li>
            )
          })}
        </ul>

        {isBlocked && missing && missing.length > 0 && (
          <div className="rounded-xl px-3 py-2 text-xs font-semibold"
            style={{ background: "#fff0d6", color: "#b37a00" }}>
            🛒 Falta comprar: {missing.join(", ")}
          </div>
        )}

        <button type="button" onClick={handleCook} disabled={!!isBlocked}
          className={cn(
            "w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all mt-1",
            isBlocked
              ? "cursor-not-allowed opacity-50"
              : "text-white hover:opacity-90 active:scale-95"
          )}
          style={isBlocked
            ? { background: "#e0d9ce", color: "#9ba49a" }
            : { background: "linear-gradient(135deg, #1a3c2e 0%, #2d7a4f 100%)" }}>
          {isBlocked
            ? <><Lock className="size-4" /> Completá los ingredientes</>
            : <><Check className="size-4" /> ¡Cocinada! Restar stock</>
          }
        </button>
      </div>
    </article>
  )
}
