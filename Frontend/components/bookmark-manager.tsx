'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Plus } from 'lucide-react'
import { Bookmark, extractTags } from '@/Frontend/lib/bookmark-store'
import { createBookmark, deleteBookmark, fetchBookmarks, fetchTags, updateBookmark } from '@/Frontend/lib/bookmark-api'
import { logout } from '@/Frontend/lib/auth-api'
import { Sidebar } from './sidebar'
import { BookmarkCard } from './bookmark-card'
import { BookmarkModal } from './bookmark-modal'
import { SearchBar } from './search-bar'

export function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiTags, setApiTags] = useState<string[]>([])

  const tags = useMemo(() => apiTags.length > 0 ? apiTags : extractTags(bookmarks), [apiTags, bookmarks])
  const filteredBookmarks = bookmarks

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [bookmarkData, tagData] = await Promise.all([
        fetchBookmarks({
          search: searchQuery || undefined,
          tag: selectedTag,
          limit: 100,
        }),
        fetchTags(),
      ])

      setBookmarks(bookmarkData)
      setApiTags(tagData.map((tag) => tag.name).sort())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookmarks')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedTag])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData()
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [loadData])

  // Keyboard shortcut for adding bookmark
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        setEditingBookmark(null)
        setIsModalOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSaveBookmark = async (url: string, title: string, tagList: string[]) => {
    if (editingBookmark) {
      await updateBookmark(editingBookmark.id, {
        url,
        title,
        tags: tagList.length > 0 ? tagList : ['uncategorized'],
      })
    } else {
      await createBookmark({
        url,
        title,
        tags: tagList.length > 0 ? tagList : ['uncategorized'],
      })
    }

    await loadData()
  }

  const handleDeleteBookmark = async (id: string) => {
    await deleteBookmark(id)
    await loadData()
  }

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setIsModalOpen(true)
  }

  const handleOpenAddModal = () => {
    setEditingBookmark(null)
    setIsModalOpen(true)
  }

  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBookmark(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        tags={tags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        bookmarkCount={bookmarks.length}
      />

      {/* Main content */}
      <main className="pl-56">
        <div className="max-w-5xl mx-auto px-8 py-10">
          {/* Header */}
          <header className="flex items-center justify-between gap-6 mb-10">
            <div className="flex-1 max-w-md">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 border border-white/10 bg-white/5 text-sm font-medium rounded-xl hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Bookmark
            </motion.button>
          </header>

          {/* Section title */}
          <div className="mb-6">
            <h2 className="text-xs text-muted-foreground uppercase tracking-wider">
              {selectedTag ? `#${selectedTag}` : 'All Bookmarks'}
              <span className="ml-2 text-foreground/40">({filteredBookmarks.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">Loading bookmarks from the database...</div>
          ) : error ? (
            <div className="py-16 text-center text-sm text-destructive">{error}</div>
          ) : bookmarks.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {bookmarks.map((bookmark, index) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={handleDeleteBookmark}
                    onEdit={handleEditBookmark}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <p className="text-muted-foreground text-sm">No bookmarks found</p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                {searchQuery ? 'Try a different search' : 'Add your first bookmark to get started'}
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Bookmark modal for add/edit */}
      <BookmarkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBookmark}
        bookmark={editingBookmark}
      />
    </div>
  )
}
