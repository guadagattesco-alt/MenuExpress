import {
  RECIPES_DB,
  type Recipe,
  type RecipeCategory,
  type Durability,
} from "./recipes"

export interface PlanEntry {
  day: number
  lunch: Recipe
  dinner: Recipe
}

export interface ShoppingItem {
  item: string
  quantity: number
  unit: string
  durability: Durability
}

export function generatePlan(
  days: number,
  objective: RecipeCategory,
): PlanEntry[] {
  const pool = RECIPES_DB.filter((r) => r.category === objective)
  const lunches = pool.filter((r) => r.type === "almuerzo")
  const dinners = pool.filter((r) => r.type === "cena")

  if (lunches.length === 0 || dinners.length === 0) return []

  const plan: PlanEntry[] = []
  for (let day = 1; day <= days; day++) {
    const lunch = lunches[(day - 1) % lunches.length]
    const dinner = dinners[(day - 1) % dinners.length]
    plan.push({ day, lunch, dinner })
  }
  return plan
}

export function buildShoppingList(plan: PlanEntry[]): {
  almacen: ShoppingItem[]
  fresco: ShoppingItem[]
} {
  const map = new Map<string, ShoppingItem>()

  for (const entry of plan) {
    for (const recipe of [entry.lunch, entry.dinner]) {
      for (const ing of recipe.ingredients) {
        const key = `${ing.item}__${ing.unit}`
        const existing = map.get(key)
        if (existing) {
          existing.quantity += ing.quantity
        } else {
          map.set(key, {
            item: ing.item,
            quantity: ing.quantity,
            unit: ing.unit,
            durability: ing.durability,
          })
        }
      }
    }
  }

  const all = Array.from(map.values()).sort((a, b) =>
    a.item.localeCompare(b.item, "es"),
  )

  return {
    almacen: all.filter((i) => i.durability === "almacen"),
    fresco: all.filter((i) => i.durability === "fresco"),
  }
}
