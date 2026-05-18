'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Bookmark, getTagColor } from '@/lib/bookmark-store'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
  onEdit: (bookmark: Bookmark) => void
  index: number
}

export function BookmarkCard({ bookmark, onDelete, onEdit, index }: BookmarkCardProps) {
  const domain = bookmark.domain || new URL(bookmark.url).hostname.replace('www.', '')

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative"
    >
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5 rounded-xl bg-card border border-border/50 hover:border-border transition-all duration-200 hover:bg-secondary/30"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {bookmark.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              {domain}
            </p>
            {bookmark.description ? (
              <p className="text-xs text-muted-foreground/80 mt-2 line-clamp-2">
                {bookmark.description}
              </p>
            ) : null}
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onEdit(bookmark)
              }}
              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Edit bookmark"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDelete(bookmark.id)
              }}
              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Delete bookmark"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] rounded-full font-medium"
              style={{
                backgroundColor: `color-mix(in oklch, ${getTagColor(tag)} 15%, transparent)`,
                color: getTagColor(tag),
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </a>
    </motion.article>
  )
}
