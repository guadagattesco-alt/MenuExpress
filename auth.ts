import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/prisma/db"
import bcrypt from "bcrypt"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        if (!user) return null
        const match = await bcrypt.compare(credentials.password as string, user.password)
        if (!match) return null
        return { id: user.id, name: user.name, email: user.email }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existing = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        if (!existing) {
          await prisma.user.create({
            data: {
              name: user.name ?? "Usuario",
              email: user.email!,
              password: "",
            }
          })
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! }
        })
        if (dbUser) session.user.id = dbUser.id
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    }
  },
  pages: {
    signIn: "/",
  },
  session: { strategy: "jwt" },
})