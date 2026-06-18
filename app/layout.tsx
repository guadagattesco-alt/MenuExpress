import type { Metadata, Viewport } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ToastProvider } from "@/lib/toast-context"
import { StockProvider } from "@/lib/stock-context"

export const metadata: Metadata = {
  title: "MenuExpress — Tu planificador gastronómico",
  description: "Planificá tus comidas, gestioná tu heladera y descubrí qué cocinar hoy.",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#1a3c2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ToastProvider>
            <StockProvider>
              {children}
            </StockProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}