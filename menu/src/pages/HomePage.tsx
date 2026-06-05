import { Link } from 'react-router-dom'
import type { Tenant } from '../types'
import './home.css'
import QRMenuGustFLow from './QRMenuGustFLow'
const platformMetrics = [
  { label: 'Hotels onboarded', value: '138', detail: 'Across enterprise, resort, and boutique plans' },
  { label: 'Orders processed', value: '418K', detail: 'Tenant-isolated table, room, and lounge orders' },
  { label: 'Payment success', value: '98.6%', detail: 'Cards, wallets, room charge, and loyalty redemption' },
  { label: 'Realtime uptime', value: '99.98%', detail: 'Kitchen, waiter, and guest status events' },
]

const roleExperiences = [
  { label: 'Super Admin', path: '/super-admin', detail: 'Logs in first, approves hotels, and assigns owner accounts to each tenant.' },
  { label: 'Hotel Owner', path: '/owner', detail: 'Owns one hotel workspace, manages brand and QR menus, and creates hotel managers.' },
  { label: 'Hotel Manager', path: '/manager', detail: 'Sees only their assigned hotel, then creates waiter, kitchen, and reception accounts.' },
  { label: 'Waiter', path: '/waiter', detail: 'Works table orders, guest requests, and service timing for the assigned hotel.' },
  { label: 'Kitchen', path: '/kitchen', detail: 'Receives only that hotel kitchen queue, station load, and order priority.' },
  { label: 'Reception', path: '/reception', detail: 'Handles check-ins, room tasks, and guest notes for the same hotel context.' },
  { label: 'Guest', path: '/guest-menu', detail: 'Scans the hotel QR menu, orders, pays, and tracks service without admin access.' },
]

const architecture = [
  'Super Admin can create HOTEL_OWNER accounts and explicitly assign them to a target hotel.',
  'Hotel Owner can create HOTEL_MANAGER accounts only inside their own hotel context.',
  'Hotel Manager can create WAITER, KITCHEN_STAFF, and RECEPTIONIST accounts for the same hotel.',
  'Hotel-scoped users cannot create or list users for another tenant, even if a different tenant header is sent.',
  'Protected dashboards map each login role to its own workspace after sign-in.',
  'QR guest routes stay public, but ordering data is still resolved through the hotel slug or subdomain.',
]

const accountFlow = [
  ['1', 'Super Admin', 'Creates hotels and assigns hotel owners'],
  ['2', 'Hotel Owner', 'Creates managers for their own property'],
  ['3', 'Hotel Manager', 'Creates operational staff for that hotel'],
  ['4', 'Hotel Teams', 'Use role-specific dashboards with hotel-scoped data'],
]

export function HomePage({ tenant }: { tenant: Tenant }) {
  return (
    <div className="page-shell landing-page">
      <header className="public-nav" aria-label="Public navigation">
        <div>
          <Link className="public-brand" to="/">
          <span className='AG'><span className='A'>A</span><span className='G'>G</span>  </span>
          <strong className='os'>Hospitality OS</strong>
        </Link>
        </div>

        <div>
           <nav className="public-menu" aria-label="Public menu">
          <a  className='workspace' href="#workspaces">Workspaces</a>
          <a  className="accessmodels"  href="#access-model">Access model</a>
          {/* <Link to="/guest-menu">Guest menu</Link> */}
          <Link className="primary-button" to="/login">Login</Link>
        </nav>
        </div>

    
      </header>

      <section className="landing-hero">
        <div>
          <p className="eyebrow">Role-based hotel SaaS</p>
          <h1>Super admin creates owners. Owners create managers. Every team gets one scoped dashboard.</h1>
          <p>
            Start with platform login, assign each hotel owner to a tenant, let owners add their
            managers, and keep every manager, kitchen, waiter, and reception user locked to the
            hotel they belong to.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/login">Login to workspace</Link>
            <Link className="secondary-button" to="/guest-menu">Preview guest QR menu</Link>
          </div>
        </div>
        <div className="landing-device account-flow-card" aria-label="Account assignment flow">
          <div className="devices-top ">
           <span className='AG'><span className='A'>A</span><span className='G'>G</span></span>
            <strong>Account hierarchy</strong>
          </div>
          {accountFlow.map(([step, title, detail]) => (
            <div className="device-row flow-row" key={title}>
              <span className='stepsflow'>{step}</span>
              <div>
                <strong>{title}</strong>
                <small>{detail}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="metric-grid wide-grid">
        {platformMetrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </div>

      <section className="section-card" id="workspaces">
        <div className="section-heading">
          <span className="eyebrow">Scoped workspaces</span>
          <h2>Every login opens the right dashboard</h2>
        </div>
        <div className="feature-grid">
          {roleExperiences.map((role) => (
            <Link className="feature-tile" key={role.path} to={role.path}>
              <strong>{role.label}</strong>
              <span>{role.detail}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-card accessmodel grid-2" id="access-model">
        <div >
          <div className="section-heading">
            <span className="eyebrow">Access model</span>
            <h2>Built around hotel ownership boundaries</h2>
          </div>
          <div className="feature-list">
            {architecture.map((item) => (
              <div key={item} className="list-items">
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="section-heading">
            <span className="eyebrow">Active tenant</span>
            <h2>{tenant.name}</h2>
          </div>
          <div className="detail-list production-detail left">
            <div className='left'><strong>Tenant slug</strong><span>{tenant.slug}</span></div>
            <div className='left'><strong>Domain</strong><span>{tenant.domain ?? `${tenant.slug}.platform.com`}</span></div>
            <div className='left'><strong>Branches</strong><span>{tenant.branchCount ?? 1} connected locations</span></div>
            <div className='left'><strong>Languages</strong><span>{(tenant.languages ?? ['English']).join(', ')}</span></div>
            <div className='left'><strong>QR route</strong><span>/hotel/{tenant.slug}/menu</span></div>
          </div>
        </div>
        
      </section>
      <div>
        <QRMenuGustFLow/>
      </div>
    </div>
  )
}
