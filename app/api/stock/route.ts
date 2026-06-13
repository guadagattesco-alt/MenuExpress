import { NextResponse } from "next/server"
import { prisma } from "@/prisma/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    if (!userId) return NextResponse.json({ error: "Falta userId" }, { status: 400 })

    const entries = await prisma.stock.findMany({ where: { userId } })

    const stock: Record<string, { quantity: number; unit: string }> = {}
    for (const e of entries) {
      stock[e.ingredient] = { quantity: e.quantity, unit: e.unit }
    }

    return NextResponse.json({ stock, found: entries.length > 0 })
  } catch (error: any) {
    console.error("Error al obtener el stock:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, stock } = body
    if (!userId || !stock) return NextResponse.json({ error: "Faltan datos" }, { status: 400 })

    await prisma.stock.deleteMany({ where: { userId } })

    const data = Object.entries(stock).map(([ingredient, info]: [string, any]) => ({
      ingredient,
      quantity: info.quantity,
      unit: info.unit,
      userId,
    }))

    if (data.length > 0) {
      await prisma.stock.createMany({ data })
    }

    return NextResponse.json({ message: "Stock guardado" }, { status: 200 })
  } catch (error: any) {
    console.error("Error al guardar el stock:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}