import { NextResponse } from "next/server"
import { prisma } from "@/prisma/db"
import { RECIPES_DB } from "@/lib/recipes"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Falta userId" }, { status: 400 })
    }

    const entries = await prisma.weeklyPlan.findMany({
      where: { userId },
      orderBy: { dayNumber: "asc" },
    })

    if (entries.length === 0) {
      return NextResponse.json({ plan: null })
    }

    const days = Math.max(...entries.map(e => e.dayNumber))
    const objective = entries[0].objective

    const byDay = new Map<number, { lunch?: any; dinner?: any; cookedLunch?: boolean; cookedDinner?: boolean }>()
for (const e of entries) {
  const recipe = RECIPES_DB.find(r => r.id === e.recipeId)
  if (!recipe) continue
  const d = byDay.get(e.dayNumber) || {}
  if (e.mealType === "almuerzo") { d.lunch = recipe; d.cookedLunch = e.cooked }
  else { d.dinner = recipe; d.cookedDinner = e.cooked }
  byDay.set(e.dayNumber, d)
}

const plan = Array.from(byDay.entries())
  .sort(([a], [b]) => a - b)
  .map(([day, d]) => ({
    day, lunch: d.lunch, dinner: d.dinner,
    cookedLunch: !!d.cookedLunch, cookedDinner: !!d.cookedDinner,
  }))
  .filter(e => e.lunch && e.dinner)

    return NextResponse.json({ plan, days, objective })
  } catch (error: any) {
    console.error("Error al obtener el plan:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, days, objective, plan } = body

    if (!userId || !plan) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    await prisma.weeklyPlan.deleteMany({ where: { userId } })

    const data = plan.flatMap((entry: any) => [
  { dayNumber: entry.day, recipeId: entry.lunch.id, mealType: "almuerzo", objective, userId, cooked: !!entry.cookedLunch },
  { dayNumber: entry.day, recipeId: entry.dinner.id, mealType: "cena", objective, userId, cooked: !!entry.cookedDinner },
])

    await prisma.weeklyPlan.createMany({ data })

    return NextResponse.json({ message: "Plan guardado" }, { status: 200 })
  } catch (error: any) {
    console.error("Error al guardar el plan:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}