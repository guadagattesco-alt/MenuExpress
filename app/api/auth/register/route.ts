import { NextResponse } from "next/server"
import { prisma } from "@/prisma/db"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      )
    }

    // Acercamiento simple con la instancia global si no la usamos acá
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 }
      )
    }

    // Encriptamos usando crypto (SHA256) para evitar el choque de Bcrypt con Next.js
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      }
    })

    return NextResponse.json(
      { message: "Usuario creado con éxito", userId: newUser.id },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Error real en el backend:", error)
    return NextResponse.json(
      { error: "Error interno", details: error.message },
      { status: 500 }
    )
  }
}