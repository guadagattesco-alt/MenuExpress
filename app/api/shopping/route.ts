import { NextResponse } from "next/server"
import { prisma } from "@/prisma/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    if (!userId) return NextResponse.json({ error: "Falta userId" }, { status: 400 })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { shoppingBought: true },
    })

    return NextResponse.json({ boughtItems: user?.shoppingBought ?? [] })
  } catch (error: any) {
    console.error("Error al obtener la lista de compras:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, boughtItems } = body
    if (!userId || !Array.isArray(boughtItems)) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { shoppingBought: boughtItems },
    })

    return NextResponse.json({ message: "Guardado" }, { status: 200 })
  } catch (error: any) {
    console.error("Error al guardar la lista de compras:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}