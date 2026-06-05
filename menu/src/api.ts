import { getAuthHeader } from './auth'
import type { AssignableRole, KitchenOrder, MenuCategory, ServiceRequest, Tenant, UserAccount } from './types'

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'

async function getErrorMessage(res: Response, fallback: string) {
  const body = await res.json().catch(() => null)
  const issueMessage = Array.isArray(body?.issues)
    ? body.issues
        .map((issue: { path?: string[]; message?: string }) => {
          const field = issue.path?.join('.')
          return [field, issue.message].filter(Boolean).join(': ')
        })
        .filter(Boolean)
        .join('; ')
    : ''

  return body?.message || issueMessage || body?.error || res.statusText || fallback
}

export async function login(email: string, password: string) {
  const res = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Invalid credentials'))
  }

  return res.json()
}

export async function createUser(
  tenantSlug: string,
  user: { email: string; fullName: string; password: string; role: AssignableRole; hotelSlug?: string },
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
    throw new Error(await getErrorMessage(res, 'Failed to create user'))
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
    throw new Error(await getErrorMessage(res, 'Failed to load users'))
  }

  return res.json() as Promise<{ users: UserAccount[] }>
}

const languageLabels: Record<string, string> = {
  en: 'English',
  am: 'Amharic',
  ar: 'Arabic',
  fr: 'French',
  es: 'Spanish',
}

type ApiTenant = {
  name: string
  slug: string
  subdomain?: string
  logoUrl?: string
  primaryColor?: string
  secondaryColor?: string
  defaultLanguage?: string
  subscriptionStatus?: string
  branchCount?: number
}

function logoMarkFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'HT'
}

function mapTenant(tenant: ApiTenant): Tenant {
  const language = languageLabels[tenant.defaultLanguage ?? ''] ?? tenant.defaultLanguage ?? 'English'

  return {
    name: tenant.name,
    slug: tenant.slug,
    subdomain: tenant.subdomain,
    logoUrl: tenant.logoUrl,
    plan: tenant.subscriptionStatus ?? 'trial',
    accent: tenant.primaryColor ?? '#0f766e',
    surface: '#f7fbf9',
    domain: tenant.subdomain ? `${tenant.subdomain}.platform.com` : `${tenant.slug}.platform.com`,
    logoMark: logoMarkFromName(tenant.name),
    branchCount: tenant.branchCount,
    languages: [language],
    defaultLanguage: tenant.defaultLanguage,
    subscriptionStatus: tenant.subscriptionStatus,
  }
}

export async function getTenants(): Promise<{ tenants: Tenant[] }> {
  const res = await fetch(`${apiBaseUrl}/api/v1/tenants`)

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Failed to load tenants'))
  }

  const data = (await res.json()) as { tenants: ApiTenant[] }
  return { tenants: data.tenants.map(mapTenant) }
}

export async function resolveTenant(slug: string): Promise<{ tenant: Tenant }> {
  const res = await fetch(`${apiBaseUrl}/api/v1/tenants/resolve/${encodeURIComponent(slug)}`)

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Failed to resolve tenant'))
  }

  const data = (await res.json()) as { tenant: ApiTenant }
  return { tenant: mapTenant(data.tenant) }
}

export async function getPublicMenu(tenantSlug: string): Promise<{ categories: MenuCategory[] }> {
  const res = await fetch(`${apiBaseUrl}/api/v1/menu`, {
    headers: {
      'x-tenant-slug': tenantSlug,
    },
  })

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Failed to load menu'))
  }

  return res.json()
}

export async function getKitchenOrders(tenantSlug: string) {
  const authHeader = getAuthHeader()
  if (!authHeader) {
    throw new Error('Authentication required')
  }

  const res = await fetch(`${apiBaseUrl}/api/v1/orders/kitchen`, {
    headers: {
      Authorization: authHeader,
      'x-tenant-slug': tenantSlug,
    },
  })

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Failed to load kitchen orders'))
  }

  return res.json() as Promise<{ orders: KitchenOrder[] }>
}

export async function getServiceRequests(tenantSlug: string) {
  const authHeader = getAuthHeader()
  if (!authHeader) {
    throw new Error('Authentication required')
  }

  const res = await fetch(`${apiBaseUrl}/api/v1/service-requests`, {
    headers: {
      Authorization: authHeader,
      'x-tenant-slug': tenantSlug,
    },
  })

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Failed to load service requests'))
  }

  return res.json() as Promise<{ serviceRequests: ServiceRequest[] }>
}

export type ManagerDashboardData = {
  summary: {
    reservations: number
    rooms: number
    availableRooms: number
    tables: number
    menuItems: number
    activeOrders: number
    openServiceRequests: number
    users: number
  }
  reservations: Array<{
    _id: string
    guestName: string
    email?: string
    phone?: string
    startsAt: string
    partySize: number
    notes?: string
  }>
  rooms: Array<{
    _id: string
    number: string
    floor?: string
    qrToken: string
    isActive: boolean
  }>
  tables: Array<{
    _id: string
    label: string
    qrToken: string
    isActive: boolean
  }>
  categories: Array<{
    _id: string
    name: string
    sortOrder?: number
    isActive: boolean
  }>
  menuItems: Array<{
    _id: string
    categoryId: string
    name: string
    price: number
    isAvailable: boolean
    prepMinutes?: number
    tags?: string[]
  }>
  orders: Array<{
    _id: string
    status: string
    total: number
    createdAt?: string
    tableId?: { label?: string } | null
    roomId?: { number?: string } | null
    items: Array<{ nameSnapshot: string; quantity: number; unitPrice: number }>
  }>
  kitchenOrders: ManagerDashboardData['orders']
  serviceRequests: Array<{
    _id: string
    type: string
    isOpen: boolean
    createdAt?: string
    tableId?: { label?: string } | null
    roomId?: { number?: string } | null
  }>
  users: Array<{
    _id: string
    email: string
    fullName: string
    role: string
    isActive: boolean
  }>
}

export async function getManagerDashboard(tenantSlug: string) {
  const authHeader = getAuthHeader()
  if (!authHeader) {
    throw new Error('Authentication required')
  }

  const res = await fetch(`${apiBaseUrl}/api/v1/manager/dashboard`, {
    headers: {
      Authorization: authHeader,
      'x-tenant-slug': tenantSlug,
    },
  })

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Failed to load manager dashboard'))
  }

  return res.json() as Promise<ManagerDashboardData>
}
