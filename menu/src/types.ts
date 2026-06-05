export type UserRole =
  | 'SUPER_ADMIN'
  | 'HOTEL_OWNER'
  | 'HOTEL_MANAGER'
  | 'WAITER'
  | 'KITCHEN_STAFF'
  | 'RECEPTIONIST'
  | 'GUEST'

export const userRoleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  HOTEL_OWNER: 'Hotel Owner',
  HOTEL_MANAGER: 'Hotel Manager',
  WAITER: 'Waiter',
  KITCHEN_STAFF: 'Kitchen Staff',
  RECEPTIONIST: 'Receptionist',
  GUEST: 'Guest',
}

export type MenuItem = {
  _id: string
  name: string
  category?: string
  categoryId?: string
  price: number
  rating?: number
  tags: string[]
  accent?: string
  description?: string
  image?: string
  imageUrl?: string
  prepMinutes?: number
}

export type MenuCategory = {
  _id: string
  name: string
  items: MenuItem[]
}

export type Tenant = {
  name: string
  slug: string
  plan: string
  accent: string
  surface: string
  domain?: string
  logoMark?: string
  branchCount?: number
  languages?: string[]
  subdomain?: string
  logoUrl?: string
  defaultLanguage?: string
  subscriptionStatus?: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export type AuthUser = {
  id: string
  email: string
  fullName: string
  role: UserRole
  hotelId: string | null
}

export type AuthSession = {
  user: AuthUser
  tokens: AuthTokens
}

export type AssignableRole = 'HOTEL_OWNER' | 'HOTEL_MANAGER' | 'WAITER' | 'KITCHEN_STAFF' | 'RECEPTIONIST'

export type UserAccount = {
  id: string
  email: string
  fullName: string
  role: UserRole
  hotelId: string | null
  assignedBy?: string | null
}

export type KitchenOrder = {
  _id: string
  status: string
  total: number
  createdAt?: string
  tableId?: { label?: string } | null
  roomId?: { number?: string } | null
  items: Array<{
    nameSnapshot: string
    quantity: number
    unitPrice: number
    notes?: string
  }>
}

export type ServiceRequest = {
  _id: string
  type: string
  createdAt?: string
  tableId?: { label?: string } | null
  roomId?: { number?: string } | null
}
