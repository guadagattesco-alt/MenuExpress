"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react"
import { Loader2 } from "lucide-react"

interface ToastState {
  id: number
  message: string
  spinner: boolean
  leaving: boolean
}

interface ToastContextValue {
  showToast: (message: string, options?: { spinner?: boolean }) => number
  hideToast: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)
  const idRef = useRef(0)
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = () => {
    if (autoTimer.current) clearTimeout(autoTimer.current)
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }

  const startLeave = useCallback((id: number) => {
    setToast((prev) => (prev && prev.id === id ? { ...prev, leaving: true } : prev))
    leaveTimer.current = setTimeout(() => {
      setToast((prev) => (prev && prev.id === id ? null : prev))
    }, 300)
  }, [])

  const showToast = useCallback(
    (message: string, options?: { spinner?: boolean }) => {
      clearTimers()
      const id = ++idRef.current
      const spinner = options?.spinner ?? false
      setToast({ id, message, spinner, leaving: false })
      if (!spinner) {
        autoTimer.current = setTimeout(() => startLeave(id), 2500)
      }
      return id
    },
    [startLeave],
  )

  const hideToast = useCallback(
    (id: number) => {
      clearTimers()
      startLeave(id)
    },
    [startLeave],
  )

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
        aria-live="polite"
        role="status"
      >
        {toast && (
          <div
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground shadow-lg ${
              toast.leaving ? "animate-toast-out" : "animate-toast-in"
            }`}
          >
            {toast.spinner && (
              <Loader2 className="size-4 shrink-0 animate-spin text-primary" aria-hidden="true" />
            )}
            <span className="text-pretty">{toast.message}</span>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast debe usarse dentro de ToastProvider")
  }
  return ctx
}
