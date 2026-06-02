import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import './App.css'

type Role = 'Super Admin' | 'Hotel Owner' | 'Kitchen Staff' | 'Waiter' | 'Guest'

type OrderStage = 'Received' | 'Preparing' | 'Cooking' | 'Delivering'

type MenuItem = {
  name: string
  category: string
  price: number
  rating: number
  tags: string[]
  accent: string
}

type Tenant = {
  name: string
  slug: string
  plan: string
  accent: string
  surface: string
}

const tenants: Tenant[] = [
  {
    name: 'Aster Grand Addis',
    slug: 'aster.platform.local',
    plan: 'Enterprise',
    accent: '#0f766e',
    surface: '#f4fbf8',
  },
  {
    name: 'Marina Blue Resort',
    slug: 'marina.platform.local',
    plan: 'Resort Plus',
    accent: '#2563eb',
    surface: '#f5f8ff',
  },
]

const menuItems: MenuItem[] = [
  {
    name: 'Berbere Glazed Salmon',
    category: 'Signature',
    price: 32,
    rating: 4.9,
    tags: ['Chef pick', 'High protein'],
    accent: '#db2777',
  },
  {
    name: 'Truffle Tibs Flatbread',
    category: 'Lounge',
    price: 24,
    rating: 4.8,
    tags: ['Upsell', 'Shareable'],
    accent: '#7c3aed',
  },
  {
    name: 'Garden Injera Tasting',
    category: 'Vegan',
    price: 19,
    rating: 4.7,
    tags: ['Vegan', 'Local'],
    accent: '#16a34a',
  },
]

const roles: Role[] = ['Super Admin', 'Hotel Owner', 'Kitchen Staff', 'Waiter', 'Guest']

const serviceRequests = [
  'Call waiter',
  'Need water',
  'Request bill',
  'Room cleaning',
]

const kitchenQueue = [
  { table: 'T12', item: 'Berbere Glazed Salmon', stage: 'Cooking' as OrderStage, eta: '08:20' },
  { table: 'Room 406', item: 'Garden Injera Tasting', stage: 'Preparing' as OrderStage, eta: '12:00' },
  { table: 'Lounge 3', item: 'Truffle Tibs Flatbread', stage: 'Delivering' as OrderStage, eta: '02:30' },
]

const analytics = [
  { label: 'MRR', value: '$84.2K', delta: '+18%' },
  { label: 'Orders', value: '12,480', delta: '+31%' },
  { label: 'Hotels', value: '42', delta: '+7' },
  { label: 'Retention', value: '91%', delta: '+4%' },
]

function App() {
  const [tenant, setTenant] = useState(tenants[0])
  const [role, setRole] = useState<Role>('Hotel Owner')
  const [cartCount, setCartCount] = useState(2)
  const [activeLanguage, setActiveLanguage] = useState('English')

  const tenantStyle = useMemo(
    () => ({
      '--tenant-accent': tenant.accent,
      '--tenant-surface': tenant.surface,
    }),
    [tenant],
  )

  const roleSummary = {
    'Super Admin': 'Platform revenue, hotel approvals, support tickets, and AI insights.',
    'Hotel Owner': 'Branding, QR codes, menu operations, rooms, staff, and analytics.',
    'Kitchen Staff': 'Realtime queue, cooking timers, priority orders, and handoff status.',
    Waiter: 'Active tables, guest requests, delivery tracking, and service alerts.',
    Guest: 'QR menu, room service, loyalty, payments, and live order tracking.',
  } satisfies Record<Role, string>

  return (
    <main className="app-shell" style={tenantStyle as CSSProperties}>
      <nav className="topbar" aria-label="Primary">
        <div>
          <span className="eyebrow">AI-Powered Hospitality OS</span>
          <strong>{tenant.name}</strong>
        </div>
        <div className="tenant-switcher">
          {tenants.map((option) => (
            <button
              className={option.slug === tenant.slug ? 'is-active' : ''}
              key={option.slug}
              onClick={() => setTenant(option)}
              type="button"
            >
              {option.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </nav>

      <section className="hero-grid">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="hero-copy"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow">{tenant.slug} / {tenant.plan}</span>
          <h1>One tenant-aware command center for hotel service, QR ordering, and realtime operations.</h1>
          <p>
            A production-shaped starting point for a multi-tenant hospitality SaaS:
            dashboards, guest ordering, kitchen status, waiter calls, payments, AI
            recommendations, and white-label theme controls.
          </p>
          <div className="hero-actions">
            <button type="button">Generate QR</button>
            <button className="secondary" type="button">View tenant API</button>
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="phone-preview"
          initial={{ opacity: 0, scale: 0.96 }}
          transition={{ delay: 0.12, duration: 0.5 }}
        >
          <div className="phone-status">
            <span>Table 12</span>
            <span>{activeLanguage}</span>
          </div>
          <div className="guest-card">
            <span className="eyebrow">AI recommendation</span>
            <h2>{menuItems[0].name}</h2>
            <p>Matched to previous orders, weather, and peak dinner demand.</p>
          </div>
          <div className="menu-stack">
            {menuItems.map((item) => (
              <button className="menu-row" key={item.name} onClick={() => setCartCount((count) => count + 1)} type="button">
                <span className="food-dot" style={{ background: item.accent }} />
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.category} / {item.rating} rating</small>
                </span>
                <b>${item.price}</b>
              </button>
            ))}
          </div>
          <div className="cart-bar">
            <span>{cartCount} items</span>
            <button type="button">Track order</button>
          </div>
        </motion.div>
      </section>

      <section className="control-grid" aria-label="Platform controls">
        <div className="panel role-panel">
          <div className="section-heading">
            <span className="eyebrow">RBAC dashboards</span>
            <h2>Role workspace</h2>
          </div>
          <div className="role-tabs">
            {roles.map((item) => (
              <button className={item === role ? 'is-active' : ''} key={item} onClick={() => setRole(item)} type="button">
                {item}
              </button>
            ))}
          </div>
          <p>{roleSummary[role]}</p>
          <div className="permission-list">
            <span>Protected routes</span>
            <span>Tenant scoped APIs</span>
            <span>JWT sessions</span>
            <span>Permission matrix</span>
          </div>
        </div>

        <div className="panel analytics-panel">
          <div className="section-heading">
            <span className="eyebrow">Super admin</span>
            <h2>SaaS health</h2>
          </div>
          <div className="metric-grid">
            {analytics.map((metric) => (
              <article key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.delta}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="panel kitchen-panel">
          <div className="section-heading">
            <span className="eyebrow">Socket.io ready</span>
            <h2>Live kitchen queue</h2>
          </div>
          <div className="queue-list">
            {kitchenQueue.map((order) => (
              <article key={`${order.table}-${order.item}`}>
                <span>
                  <strong>{order.table}</strong>
                  <small>{order.item}</small>
                </span>
                <b>{order.stage}</b>
                <time>{order.eta}</time>
              </article>
            ))}
          </div>
        </div>

        <div className="panel service-panel">
          <div className="section-heading">
            <span className="eyebrow">Guest services</span>
            <h2>Smart waiter call</h2>
          </div>
          <div className="request-grid">
            {serviceRequests.map((request) => (
              <button key={request} type="button">{request}</button>
            ))}
          </div>
          <div className="language-row">
            {['English', 'Amharic', 'Arabic', 'French'].map((language) => (
              <button
                className={language === activeLanguage ? 'is-active' : ''}
                key={language}
                onClick={() => setActiveLanguage(language)}
                type="button"
              >
                {language}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="roadmap">
        <div className="section-heading">
          <span className="eyebrow">Implementation roadmap</span>
          <h2>Production architecture modules</h2>
        </div>
        <div className="roadmap-grid">
          {[
            'Tenant middleware and theme engine',
            'Prisma hotel_id isolation',
            'JWT auth and RBAC',
            'Menu, cart, checkout, orders',
            'Realtime kitchen and waiter events',
            'PWA offline cache and push',
            'AI recommendations and analytics',
            'Payments: Chapa, Stripe, PayPal',
          ].map((item) => (
            <article key={item}>{item}</article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
