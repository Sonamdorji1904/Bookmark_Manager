'use client'

import { motion } from 'framer-motion'
import { getTagColor } from '@/Frontend/lib/bookmark-store'
import { ThemeToggle } from './theme-toggle'

interface SidebarProps {
  tags: string[]
  selectedTag: string | null
  onSelectTag: (tag: string | null) => void
  bookmarkCount: number
}

export function Sidebar({ tags, selectedTag, onSelectTag, bookmarkCount }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-56 border-r border-border/50 bg-background/80 backdrop-blur-sm z-10">
      <div className="flex flex-col h-full p-6">
        {/* Logo and Theme Toggle */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-medium text-foreground tracking-tight">Bookmarks</h1>
            <p className="text-xs text-muted-foreground mt-1">{bookmarkCount} saved</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <div className="mb-6">
            <button
              onClick={() => onSelectTag(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedTag === null
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              All Bookmarks
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider px-3 mb-3">Tags</p>
            {tags.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => onSelectTag(tag)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  selectedTag === tag
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getTagColor(tag) }}
                />
                {tag}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Footer hint */}
        <div className="pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">N</kbd> to add new
          </p>
        </div>
      </div>
    </aside>
  )
}
