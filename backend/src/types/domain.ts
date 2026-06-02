export const userRoles = [
  'SUPER_ADMIN',
  'HOTEL_OWNER',
  'HOTEL_MANAGER',
  'WAITER',
  'KITCHEN_STAFF',
  'RECEPTIONIST',
  'GUEST',
] as const

export type UserRole = (typeof userRoles)[number]

export const orderStatuses = [
  'RECEIVED',
  'PREPARING',
  'COOKING',
  'READY',
  'DELIVERING',
  'COMPLETED',
  'CANCELLED',
] as const

export type OrderStatus = (typeof orderStatuses)[number]

export const paymentStatuses = ['PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED'] as const

export type PaymentStatus = (typeof paymentStatuses)[number]

export const serviceRequestTypes = [
  'CALL_WAITER',
  'NEED_WATER',
  'REQUEST_BILL',
  'CLEANING_REQUEST',
] as const

export type ServiceRequestType = (typeof serviceRequestTypes)[number]
