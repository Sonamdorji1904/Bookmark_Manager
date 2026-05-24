'use client'

import { ArrowRight, Bookmark, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/Frontend/components/ui/button'
import { Card, CardContent } from '@/Frontend/components/ui/card'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

const highlights = [
  'Google-only sign in',
  'JWT in secure cookies',
  'Fast bookmark search',
]

export function LoginLanding() {
  const startGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_35%),linear-gradient(180deg,_#0b0c10_0%,_#10131a_45%,_#090a0d_100%)] text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-[-8rem] h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_38%,transparent_70%)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.35em] text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Bookmark Manager
            </div>

            <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.04em] text-balance text-white md:text-7xl">
              Capture links once. Find them instantly.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              Sign in with your Google account to sync your bookmarks, tags, and saved pages in one focused workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200/90 backdrop-blur"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
          >
            <Card className="overflow-hidden border-white/10 bg-white/6 shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <CardContent className="p-8 md:p-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-lg shadow-black/20">
                  <Bookmark className="h-7 w-7" />
                </div>

                <div className="mt-8 space-y-3">
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Welcome back</p>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Continue with Google</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Use your Google account to sign in. No password fields, no signup form, just one authenticated session.
                  </p>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <Button
                    type="button"
                    onClick={startGoogleLogin}
                    className="h-12 w-full rounded-xl bg-white px-5 text-sm font-medium text-slate-950 hover:bg-white/90"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                      G
                    </span>
                    Continue with Google
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}