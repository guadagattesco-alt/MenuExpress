import { NextResponse } from "next/server"
import { prisma } from "@/prisma/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, recipeId, recipeName } = body

    if (!userId || !recipeId || !recipeName) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    await prisma.cookedRecipe.create({
      data: { userId, recipeId, recipeName }
    })

    return NextResponse.json({ message: "Registrado" }, { status: 201 })
  } catch (error: any) {
    console.error("Error al registrar receta cocinada:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}