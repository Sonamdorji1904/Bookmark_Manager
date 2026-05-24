const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export type AuthUser = {
  id: string
  name: string
  email: string
  avatar: string | null
  provider: 'google'
  providerId: string
  createdAt: string
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

export const fetchCurrentUser = async () => {
  return request<AuthUser>('/api/auth/me')
}

export const logout = async () => {
  return request<null>('/api/auth/logout', {
    method: 'POST',
  })
}