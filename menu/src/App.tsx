import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom'
import { type CSSProperties, type ReactNode, useMemo, useState } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './auth'
import { GuestMenuPage } from './pages/GuestMenuPage'
import { HomePage } from './pages/HomePage'
import { HotelManagerDashboard } from './pages/HotelManagerDashboard'
import { HotelOwnerDashboard } from './pages/HotelOwnerDashboard'
import { KitchenDashboard } from './pages/KitchenDashboard'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ReceptionistDashboard } from './pages/ReceptionistDashboard'
import { SuperAdminDashboard } from './pages/SuperAdminDashboard'
import { WaiterDashboard } from './pages/WaiterDashboard'
import { GuestDashboard } from './pages/GuestDashboard'
import type { Tenant, UserRole } from './types'

const tenants: Tenant[] = [
  {
    name: 'Aster Grand Addis',
    slug: 'aster-grand-addis',
    plan: 'Enterprise',
    accent: '#0f766e',
    surface: '#f4fbf8',
    domain: 'aster-grand-addis.platform.com',
    logoMark: 'AG',
    branchCount: 4,
    languages: ['English', 'Amharic', 'Arabic'],
  },
  {
    name: 'Marina Blue Resort',
    slug: 'marina-blue-resort',
    plan: 'Resort Plus',
    accent: '#2563eb',
    surface: '#f5f8ff',
    domain: 'marina-blue-resort.platform.com',
    logoMark: 'MB',
    branchCount: 7,
    languages: ['English', 'French', 'Spanish'],
  },
]

const routes = [
  { path: '/', label: 'Home' },
  { path: '/super-admin', label: 'Super Admin' },
  { path: '/owner', label: 'Hotel Owner' },
  { path: '/manager', label: 'Hotel Manager' },
  { path: '/waiter', label: 'Waiter' },
  { path: '/kitchen', label: 'Kitchen' },
  { path: '/reception', label: 'Reception' },
  { path: '/guest', label: 'Guest' },
  { path: '/guest-menu', label: 'Guest Menu' },
]

function RoleProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[]
  children: ReactNode
}) {
  const { session } = useAuth()

  if (!session) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  }

  if (!allowedRoles.includes(session.user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const initialTenant = useMemo(() => {
    const pathSlug = window.location.pathname.match(/^\/hotel\/([^/]+)/)?.[1]
    const hostSlug = window.location.hostname.split('.')[0]
    return (
      tenants.find((item) => item.slug === pathSlug || item.slug === hostSlug) ??
      tenants[0]
    )
  }, [])
  const [tenant, setTenant] = useState<Tenant>(initialTenant)

  const tenantStyle = useMemo(
    () => ({
      '--tenant-accent': tenant.accent,
      '--tenant-surface': tenant.surface,
    }),
    [tenant],
  )

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell" style={tenantStyle as CSSProperties}>
          <header className="topbar" aria-label="Application header">
            <div className="brand-lockup">
              <span className="logo-mark">{tenant.logoMark}</span>
              <div>
                <span className="eyebrow">Hospitality OS</span>
                <strong>{tenant.name}</strong>
                <small>{tenant.domain ?? `${tenant.slug}.platform.com`}</small>
              </div>
            </div>
            <div className="topbar-actions">
              <span className="subtitle">Tenant</span>
              <div className="tenant-switcher">
                {tenants.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    className={item.slug === tenant.slug ? 'is-active' : ''}
                    onClick={() => setTenant(item)}
                  >
                    {item.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="app-grid">
            <aside className="sidebar" aria-label="Dashboard navigation">
              <div className="sidebar-brand">
                <span className="eyebrow">Dashboards</span>
                <strong>Role and tenant views</strong>
              </div>
              <nav className="nav-list">
                {routes.map((route) => (
                  <NavLink
                    key={route.path}
                    to={route.path}
                    className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
                  >
                    {route.label}
                  </NavLink>
                ))}
              </nav>
            </aside>

            <main className="page-content">
              <Routes>
                <Route path="/" element={<HomePage tenant={tenant} />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/super-admin"
                  element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                      <SuperAdminDashboard tenant={tenant} />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/owner"
                  element={
                    <RoleProtectedRoute allowedRoles={['HOTEL_OWNER']}>
                      <HotelOwnerDashboard tenant={tenant} />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/manager"
                  element={
                    <RoleProtectedRoute allowedRoles={['HOTEL_MANAGER']}>
                      <HotelManagerDashboard tenant={tenant} />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/waiter"
                  element={
                    <RoleProtectedRoute allowedRoles={['WAITER']}>
                      <WaiterDashboard tenant={tenant} />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/kitchen"
                  element={
                    <RoleProtectedRoute allowedRoles={['KITCHEN_STAFF']}>
                      <KitchenDashboard tenant={tenant} />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/reception"
                  element={
                    <RoleProtectedRoute allowedRoles={['RECEPTIONIST']}>
                      <ReceptionistDashboard tenant={tenant} />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/guest"
                  element={
                    <RoleProtectedRoute allowedRoles={['GUEST']}>
                      <GuestDashboard tenant={tenant} />
                    </RoleProtectedRoute>
                  }
                />
                <Route path="/guest-menu" element={<GuestMenuPage tenant={tenant} />} />
                <Route path="/hotel/:slug" element={<GuestMenuPage tenant={tenant} />} />
                <Route path="/hotel/:slug/menu" element={<GuestMenuPage tenant={tenant} />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
