"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { User } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase"

interface SessionContextType {
  user: User | null
  loading: boolean
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      try {
        const supabase = getSupabaseClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user || null)
      } catch (error) {
        console.error("Failed to get session:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const supabase = getSupabaseClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <SessionContext.Provider value={{ user, loading }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within SessionProvider")
  }
  return context
}
