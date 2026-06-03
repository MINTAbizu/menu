import { Link } from 'react-router-dom'
import type { Tenant } from '../types'

const quickLinks = [
  { label: 'Super Admin', path: '/super-admin' },
  { label: 'Hotel Owner', path: '/owner' },
  { label: 'Manager', path: '/manager' },
  { label: 'Waiter', path: '/waiter' },
  { label: 'Kitchen', path: '/kitchen' },
  { label: 'Guest Menu', path: '/guest-menu' },
]

export function HomePage({ tenant }: { tenant: Tenant }) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Tenant workspace</p>
          <h1>{tenant.name} production dashboard</h1>
          <p>
            Welcome to the multi-tenant SaaS experience. Use the sidebar to switch role-specific dashboards
            and review tenant-level control panels for hotel operations, guest menus, and platform analytics.
          </p>
        </div>
      </div>

      <section className="section-card">
        <div className="section-heading">
          <span className="eyebrow">Quick launch</span>
          <h2>Role dashboards</h2>
        </div>
        <div className="card-grid">
          {quickLinks.map((link) => (
            <Link className="card-link" key={link.path} to={link.path}>
              <strong>{link.label}</strong>
              <small>Open the {link.label} experience</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <span className="eyebrow">Platform architecture</span>
          <h2>Multi-tenant SaaS foundation</h2>
        </div>
        <div className="feature-grid">
          {[
            'Tenant-aware routing and API isolation',
            'Hotel-specific branding and themes',
            'Multi-role dashboard support',
            'Secure JWT auth and RBAC',
            'Realtime orders, waiter calls, and kitchen updates',
            'Luxury mobile-first guest menu experience',
          ].map((feature) => (
            <article key={feature}>{feature}</article>
          ))}
        </div>
      </section>
    </div>
  )
}
