import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom'
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

const publicPaths = ['/', '/login', '/guest-menu']

const isPublicPath = (pathname: string) =>
  publicPaths.includes(pathname) || pathname.startsWith('/hotel/')

const roleHome: Record<UserRole, string> = {
  SUPER_ADMIN: '/super-admin',
  HOTEL_OWNER: '/owner',
  HOTEL_MANAGER: '/manager',
  WAITER: '/waiter',
  KITCHEN_STAFF: '/kitchen',
  RECEPTIONIST: '/reception',
  GUEST: '/guest-menu',
}

function AppRoutes({ tenant }: { tenant: Tenant }) {
  return (
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
  )
}

function DashboardFrame({
  tenant,
  setTenant,
}: {
  tenant: Tenant
  setTenant: (tenant: Tenant) => void
}) {
  const { session, logout } = useAuth()
  const canSwitchTenants = session?.user.role === 'SUPER_ADMIN'

  return (
    <>
      <header className="topbar   " aria-label="Application header">
        <div className="brand-lockup">
           <span className='AG'><span className='A'>A</span><span className='G'>G</span></span>
           <div>
            <span className="eyebrow  A">Hospitality OS</span>
            <strong  className='G'>{tenant.name}</strong>
            <small  className=''>{tenant.domain ?? `${tenant.slug}.platform.com`}</small>
          </div>
        </div>
        <div className="topbar-actions">
          <div className="signed-in-user">
            <span  className='A'>{session?.user.fullName ?? <span className='G'>'Signed in'</span>}</span>
            <strong  className=''>{session?.user.role.replaceAll('_', ' ').toLowerCase()}</strong>
          </div>
          {canSwitchTenants ? (
            <>
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
            </>
          ) : (
            <div className="tenant-lock">
              <span  className='G'>Assigned hotel</span>
              <strong>{tenant.name}</strong>
            </div>
          )}
          <button  className='logout' type="button" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="app-grid">
        <main className="page-content">
          <AppRoutes tenant={tenant} />
        </main>
      </div>
    </>
  )
}

function AppShell({
  tenant,
  setTenant,
  tenantStyle,
}: {
  tenant: Tenant
  setTenant: (tenant: Tenant) => void
  tenantStyle: CSSProperties
}) {
  const location = useLocation()
  const { session } = useAuth()
  const isPublic = isPublicPath(location.pathname)

  if (session && location.pathname === '/login') {
    return <Navigate to={roleHome[session.user.role]} replace />
  }

  if (isPublic) {
    return (
      <div className="public-app-shell" style={tenantStyle}>
        <AppRoutes tenant={tenant} />
      </div>
    )
  }

  return (
    <div className="app-shell" style={tenantStyle}>
      <DashboardFrame tenant={tenant} setTenant={setTenant} />
    </div>
  )
}

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
    return <Navigate to={roleHome[session.user.role]} replace />
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
        <AppShell
          tenant={tenant}
          setTenant={setTenant}
          tenantStyle={tenantStyle as CSSProperties}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
