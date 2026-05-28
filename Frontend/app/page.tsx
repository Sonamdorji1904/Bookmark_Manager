'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Loader2 } from 'lucide-react'
import { BookmarkManager } from '@/Frontend/components/bookmark-manager'
import { LoginLanding } from '@/Frontend/components/login-landing'
import { fetchCurrentUser } from '@/Frontend/lib/auth-api'
import type { AuthUser } from '@/Frontend/lib/auth-api'

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_35%),linear-gradient(180deg,_#0b0c10_0%,_#10131a_45%,_#090a0d_100%)] text-foreground">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground backdrop-blur">
        <Bookmark className="h-4 w-4" />
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking your session
      </div>
    </div>
  )
}

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadUser = async () => {
      const maxAttempts = 3

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          const currentUser = await fetchCurrentUser()

          if (active) {
            setUser(currentUser)
            setLoading(false)
          }

          return
        } catch {
          if (attempt < maxAttempts) {
            await new Promise((resolve) => window.setTimeout(resolve, 300))
            continue
          }

          if (active) {
            setUser(null)
            setLoading(false)
          }
        }
      }
    }

    void loadUser()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <AuthLoadingScreen />
  }

  if (!user) {
    return <LoginLanding />
  }

  return <BookmarkManager />
}
