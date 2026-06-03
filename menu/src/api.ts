import { getAuthHeader } from './auth'
import type { AssignableRole, MenuCategory, UserAccount } from './types'

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'

export async function login(email: string, password: string) {
  const res = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.message || res.statusText || 'Invalid credentials'
    throw new Error(message)
  }

  return res.json()
}

export async function createUser(
  tenantSlug: string,
  user: { email: string; fullName: string; password: string; role: AssignableRole },
) {
  const authHeader = getAuthHeader()
  if (!authHeader) {
    throw new Error('Authentication required')
  }

  const res = await fetch(`${apiBaseUrl}/api/v1/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
      'x-tenant-slug': tenantSlug,
    },
    body: JSON.stringify(user),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.message || res.statusText || 'Failed to create user'
    throw new Error(message)
  }

  return res.json() as Promise<{ user: UserAccount }>
}

export async function getUsers(tenantSlug: string, role?: string) {
  const authHeader = getAuthHeader()
  if (!authHeader) {
    throw new Error('Authentication required')
  }

  const query = role ? `?role=${encodeURIComponent(role)}` : ''
  const res = await fetch(`${apiBaseUrl}/api/v1/users${query}`, {
    headers: {
      Authorization: authHeader,
      'x-tenant-slug': tenantSlug,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.message || res.statusText || 'Failed to load users'
    throw new Error(message)
  }

  return res.json() as Promise<{ users: UserAccount[] }>
}

export async function getPublicMenu(tenantSlug: string): Promise<{ categories: MenuCategory[] }> {
  const res = await fetch(`${apiBaseUrl}/api/v1/menu`, {
    headers: {
      'x-tenant-slug': tenantSlug,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.message || res.statusText || 'Failed to load menu'
    throw new Error(message)
  }

  return res.json()
}
