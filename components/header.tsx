"use client"

import { LogOut } from "lucide-react"
import { useStock } from "@/lib/stock-context"
import { useAuth } from "@/lib/auth-context"

const TABS = [
  { id: "plan",       label: "🗓 Planificar Menú" },
  { id: "fridge",     label: "🧊 Mi Heladera"     },
  { id: "salvavidas", label: "🚨 Salvavidas"       },
] as const

export type TabId = (typeof TABS)[number]["id"]

interface HeaderProps {
  active: TabId
  onChange: (id: TabId) => void
  onLogout: () => void
}

export function Header({ active, onChange, onLogout }: HeaderProps) {
  const { stockCount, hydrated } = useStock()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full" style={{ background: "var(--header-bg)" }}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex items-center justify-between py-3 gap-3">
          <span className="text-xl font-bold tracking-tight text-white shrink-0"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.5px" }}>
            Menu<span style={{ color: "#3dba72" }}>Express</span>
          </span>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: "rgba(61,186,114,0.18)", color: "#7eeab0", border: "1px solid rgba(61,186,114,0.25)" }}>
              <span style={{ color: "#3dba72" }}>●</span>
              {hydrated ? stockCount : "—"} ingredientes en stock
            </span>
            {user && (
              <div className="flex items-center gap-1.5">
                <span className="hidden md:block text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {user.name}
                </span>
                <button type="button" onClick={onLogout} title="Cerrar sesión"
                  className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.7)" }}>
                  <LogOut className="size-3.5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="flex gap-0.5 sm:gap-1" aria-label="Navegación principal">
          {TABS.map((tab) => (
            <button key={tab.id} type="button" onClick={() => onChange(tab.id)}
              aria-current={active === tab.id ? "page" : undefined}
              className="shrink-0 rounded-t-xl px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap"
              style={active === tab.id
                ? { background: "var(--background)", color: "var(--primary)" }
                : { background: "transparent", color: "rgba(255,255,255,0.6)" }}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

