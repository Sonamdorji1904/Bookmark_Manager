import type { Bookmark, Tag } from '@/Frontend/lib/bookmark-store'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

type BookmarkPayload = {
  url: string
  title: string
  tags: string[]
}

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'include',
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(errorBody?.message || `Request failed with status ${response.status}`)
  }

  const body = (await response.json()) as ApiResponse<T>
  return body.data
}

export const fetchBookmarks = async (query?: {
  search?: string
  tag?: string | null
  limit?: number
}) => {
  const params = new URLSearchParams()
  if (query?.search) params.set('search', query.search)
  if (query?.tag) params.set('tag', query.tag)
  params.set('limit', String(query?.limit ?? 100))

  return request<Bookmark[]>(`/api/bookmarks?${params.toString()}`)
}

export const createBookmark = async (payload: BookmarkPayload) => {
  return request<Bookmark>('/api/bookmarks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const updateBookmark = async (
  id: string,
  payload: Partial<BookmarkPayload>,
) => {
  return request<Bookmark>(`/api/bookmarks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export const deleteBookmark = async (id: string) => {
  return request<null>(`/api/bookmarks/${id}`, {
    method: 'DELETE',
  })
}

export const fetchTags = async () => {
  return request<Tag[]>('/api/tags')
}
