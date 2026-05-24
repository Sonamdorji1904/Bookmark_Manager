export interface Bookmark {
  id: string
  url: string
  title: string
  description?: string | null
  previewImage?: string | null
  favicon?: string | null
  domain?: string | null
  tags: string[]
  category?: string | null
  isFavorite?: boolean
  createdAt?: string
}

export interface Tag {
  id: string
  name: string
  color?: string | null
}

export function extractTags(bookmarks: Bookmark[]): string[] {
  const tagSet = new Set<string>()
  bookmarks.forEach((b) => b.tags.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}

const tagColorMap: Record<string, string> = {
  dev: 'var(--tag-cyan)',
  design: 'var(--tag-pink)',
  reading: 'var(--tag-purple)',
  tools: 'var(--tag-green)',
  docs: 'var(--tag-yellow)',
  framework: 'var(--tag-cyan)',
  css: 'var(--tag-pink)',
  hosting: 'var(--tag-green)',
  inspiration: 'var(--tag-pink)',
  articles: 'var(--tag-purple)',
  productivity: 'var(--tag-yellow)',
}

export function getTagColor(tag: string): string {
  if (tagColorMap[tag]) return tagColorMap[tag]
  const hash = tag.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  const colors = ['var(--tag-cyan)', 'var(--tag-pink)', 'var(--tag-green)', 'var(--tag-yellow)', 'var(--tag-purple)']
  return colors[Math.abs(hash) % colors.length]
}
