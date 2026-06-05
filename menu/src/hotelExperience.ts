import type { MenuCategory } from './types'

export type GuestService = {
  id: string
  name: string
  category: 'Food' | 'Drink' | 'Hotel Service' | 'Wellness'
  description: string
  eta: string
  icon: string
  enabled: boolean
}

export type NutritionInfo = {
  calories: number
  protein: string
  carbs: string
  allergens: string[]
  diet: string[]
}

export type ExperienceMenuItem = MenuCategory['items'][number] & {
  nutrition?: NutritionInfo
  available?: boolean
  serviceWindow?: string
}

export type ExperienceMenuCategory = Omit<MenuCategory, 'items'> & {
  kind: 'Food' | 'Drink' | 'Service'
  description: string
  enabled: boolean
  items: ExperienceMenuItem[]
}

export type HotelGuestExperience = {
  hotelMood: string
  welcomeTitle: string
  welcomeMessage: string
  showNutrition: boolean
  showServiceEta: boolean
  defaultCurrency: string
  services: GuestService[]
  categories: ExperienceMenuCategory[]
}

const storagePrefix = 'hotel-guest-experience'

export function experienceStorageKey(tenantSlug: string) {
  return `${storagePrefix}:${tenantSlug}`
}

export const defaultGuestExperience: HotelGuestExperience = {
  hotelMood: 'Luxury comfort',
  welcomeTitle: 'Welcome to your digital hotel menu',
  welcomeMessage:
    'Explore room service, restaurant dining, lounge drinks, wellness requests, and hotel services from one QR scan.',
  showNutrition: true,
  showServiceEta: true,
  defaultCurrency: '$',
  services: [
    {
      id: 'room-service',
      name: 'Room Service',
      category: 'Hotel Service',
      description: 'Send food, drinks, amenities, or special requests to your room.',
      eta: '18-25 min',
      icon: 'RS',
      enabled: true,
    },
    {
      id: 'restaurant',
      name: 'Restaurant Dining',
      category: 'Food',
      description: 'Order to your table with kitchen routing and waiter support.',
      eta: '12-20 min',
      icon: 'FD',
      enabled: true,
    },
    {
      id: 'bar',
      name: 'Bar and Lounge',
      category: 'Drink',
      description: 'Browse mocktails, cocktails, coffee, tea, and lounge specials.',
      eta: '8-14 min',
      icon: 'DR',
      enabled: true,
    },
    {
      id: 'spa',
      name: 'Spa and Wellness',
      category: 'Wellness',
      description: 'Request massage bookings, sauna access, and wellness packages.',
      eta: 'On request',
      icon: 'SP',
      enabled: true,
    },
    {
      id: 'housekeeping',
      name: 'Housekeeping',
      category: 'Hotel Service',
      description: 'Ask for towels, cleaning, turndown, laundry, or room amenities.',
      eta: '6-12 min',
      icon: 'HK',
      enabled: true,
    },
    {
      id: 'concierge',
      name: 'Concierge',
      category: 'Hotel Service',
      description: 'Airport transfers, local tours, reservations, and guest support.',
      eta: '3-8 min',
      icon: 'CG',
      enabled: true,
    },
  ],
  categories: [
    {
      _id: 'signature-food',
      name: 'Signature Food',
      kind: 'Food',
      description: 'Chef-led dishes for restaurant, lounge, and room service.',
      enabled: true,
      items: [
        {
          _id: 'royal-breakfast',
          name: 'Aster Royal Breakfast',
          category: 'Breakfast',
          price: 18,
          tags: ['Chef picks', 'Room service', 'Under 20 min'],
          accent: '#0f766e',
          description: 'Eggs, fresh bread, fruit, coffee, and local honey.',
          prepMinutes: 16,
          available: true,
          serviceWindow: '06:00-11:00',
          nutrition: {
            calories: 620,
            protein: '28g',
            carbs: '58g',
            allergens: ['Egg', 'Wheat'],
            diet: ['Vegetarian option'],
          },
        },
        {
          _id: 'grilled-perch',
          name: 'Grilled Nile Perch',
          category: 'Dinner',
          price: 27,
          tags: ['Chef picks', 'Dinner'],
          accent: '#2563eb',
          description: 'Herb rice, vegetables, and lemon butter sauce.',
          prepMinutes: 24,
          available: true,
          serviceWindow: '12:00-23:00',
          nutrition: {
            calories: 740,
            protein: '46g',
            carbs: '52g',
            allergens: ['Fish', 'Dairy'],
            diet: ['High protein'],
          },
        },
      ],
    },
    {
      _id: 'drinks-lounge',
      name: 'Drinks and Lounge',
      kind: 'Drink',
      description: 'Coffee, fresh juice, mocktails, cocktails, and bar snacks.',
      enabled: true,
      items: [
        {
          _id: 'sky-mocktail',
          name: 'Sky Lounge Mocktail',
          category: 'Bar lounge',
          price: 9,
          tags: ['Lounge', 'Under 20 min'],
          accent: '#dc2626',
          description: 'Fresh citrus, mint, ginger, and sparkling water.',
          prepMinutes: 8,
          available: true,
          serviceWindow: '10:00-01:00',
          nutrition: {
            calories: 140,
            protein: '0g',
            carbs: '31g',
            allergens: [],
            diet: ['Alcohol free', 'Vegan'],
          },
        },
        {
          _id: 'macchiato',
          name: 'Ethiopian Macchiato',
          category: 'Coffee',
          price: 6,
          tags: ['Coffee', 'Room service'],
          accent: '#7c3f16',
          description: 'Fresh espresso, steamed milk, and cardamom aroma.',
          prepMinutes: 7,
          available: true,
          serviceWindow: '06:00-23:00',
          nutrition: {
            calories: 110,
            protein: '5g',
            carbs: '10g',
            allergens: ['Dairy'],
            diet: ['Vegetarian'],
          },
        },
      ],
    },
    {
      _id: 'guest-services',
      name: 'Guest Services',
      kind: 'Service',
      description: 'Hotel support requests available from the same QR scan.',
      enabled: true,
      items: [
        {
          _id: 'extra-towels',
          name: 'Extra Towels',
          category: 'Housekeeping',
          price: 0,
          tags: ['Housekeeping', 'Room service'],
          accent: '#0891b2',
          description: 'Fresh towels delivered to your room.',
          prepMinutes: 8,
          available: true,
          serviceWindow: '24 hours',
        },
        {
          _id: 'airport-transfer',
          name: 'Airport Transfer',
          category: 'Concierge',
          price: 35,
          tags: ['Concierge', 'Transport'],
          accent: '#7c3aed',
          description: 'Schedule a private transfer with reception confirmation.',
          prepMinutes: 10,
          available: true,
          serviceWindow: '24 hours',
        },
      ],
    },
  ],
}

export function loadGuestExperience(tenantSlug: string): HotelGuestExperience {
  if (typeof window === 'undefined') return defaultGuestExperience

  try {
    const saved = window.localStorage.getItem(experienceStorageKey(tenantSlug))
    if (!saved) return defaultGuestExperience
    return { ...defaultGuestExperience, ...JSON.parse(saved) }
  } catch {
    return defaultGuestExperience
  }
}

export function saveGuestExperience(tenantSlug: string, settings: HotelGuestExperience) {
  window.localStorage.setItem(experienceStorageKey(tenantSlug), JSON.stringify(settings))
}
