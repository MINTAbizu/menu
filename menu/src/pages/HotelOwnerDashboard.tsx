import { useState, type FormEvent } from 'react'
import { QRCode } from '../components/QRCode'
import { createUser } from '../api'
import { PasswordStrength } from '../components/PasswordStrength'
import { isStrongPassword } from '../passwordPolicy'
import type { Tenant } from '../types'
import type { AssignableRole } from '../types'
import { userRoleLabels } from '../types'

const ownerMetrics = [
  { label: 'Menu items', value: '72' },
  { label: 'Active tables', value: '48' },
  { label: 'Monthly revenue', value: '$45K' },
  { label: 'Guest CSAT', value: '94%' },
  { label: 'QR scans', value: '12.8K' },
  { label: 'Loyalty members', value: '4,280' },
  { label: 'Payment success', value: '98.6%' },
  { label: 'Repeat guests', value: '41%' },
]

const brandingOptions = [
  'Logo upload',
  'Accent colors',
  'Typography settings',
  'Menu layout presets',
]

const promotions = [
  { name: 'Sunset Dinner', metric: '20% off', status: 'Live' },
  { name: 'Weekend Brunch', metric: 'Buy 1 get 1', status: 'Draft' },
  { name: 'Late Night Happy Hour', metric: '15% off', status: 'Live' },
]

const qrLocations = [
  {
    label: 'Table 12',
    type: 'Restaurant table',
    destination: 'Main restaurant',
    token: 'qr-table-12-aster',
    queryKey: 'table',
    status: 'Active',
  },
  {
    label: 'Room 406',
    type: 'Room service',
    destination: 'Fourth floor',
    token: 'qr-room-406-aster',
    queryKey: 'room',
    status: 'Active',
  },
  {
    label: 'Lounge 3',
    type: 'Bar lounge',
    destination: 'Sky lounge',
    token: 'qr-lounge-3-aster',
    queryKey: 'table',
    status: 'Ready to print',
  },
]

function buildQrUrl(tenant: Tenant, queryKey: string, token: string) {
  const origin =
    typeof window === 'undefined'
      ? `https://${tenant.domain ?? `${tenant.slug}.platform.com`}`
      : window.location.origin
  return `${origin}/hotel/${tenant.slug}/menu?${queryKey}=${encodeURIComponent(token)}`
}

function buildPrintCardUrl(tenant: Tenant, queryKey: string, token: string) {
  return `/hotel/${tenant.slug}/menu?${queryKey}=${encodeURIComponent(token)}`
}

function AssignManagerPanel({ tenant }: { tenant: Tenant }) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [role, setRole] = useState<AssignableRole>('HOTEL_MANAGER')
  const canSubmit = Boolean(email.trim() && fullName.trim().length >= 3 && isStrongPassword(password))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setError(null)

    if (!canSubmit) {
      setError('Complete all fields and use a strong password before creating the manager.')
      return
    }

    setIsSaving(true)

    try {
      const response = await createUser(tenant.slug, {
        email: email.trim(),
        fullName: fullName.trim(),
        password,
        role,
      })

      setMessage(`Manager ${response.user.fullName} created successfully.`)
      setEmail('')
      setFullName('')
      setPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create hotel manager')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="section-card">
      <div className="section-heading">
        <span className="eyebrow">Assign manager</span>
        <h2>Create a hotel manager for this property</h2>
      </div>
      <form onSubmit={handleSubmit} className="user-form">
        <label>
          Full name
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} required placeholder="Manager name" />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="manager@example.com" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Create a strong password" autoComplete="new-password" />
        </label>
        <PasswordStrength password={password} />
        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value as AssignableRole)}>
            <option value="HOTEL_MANAGER">{userRoleLabels.HOTEL_MANAGER}</option>
          </select>
        </label>
        {error ? <div className="alert">{error}</div> : null}
        {message ? <div className="status-message">{message}</div> : null}
        <button className="primary-button" type="submit" disabled={isSaving || !canSubmit}>
          {isSaving ? 'Creating manager...' : 'Create manager'}
        </button>
      </form>
    </section>
  )
}

export function HotelOwnerDashboard({ tenant }: { tenant: Tenant }) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const copyQrUrl = async (url: string, token: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedToken(token)
    window.setTimeout(() => setCopiedToken(null), 1800)
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Hotel owner control</p>
          <h1>{tenant.name} owner dashboard</h1>
          <p>
            Manage the hotel profile, menu, promotions, staff, and loyalty operations from a single
            brand-aware workspace.
          </p>
        </div>
        <div className="qr-mini">
          <span>Tenant QR</span>
          <strong>{tenant.logoMark ?? 'QR'}</strong>
          <small>/hotel/{tenant.slug}/menu</small>
        </div>
      </div>

      <div className="metric-grid wide-grid">
        {ownerMetrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>Hotel performance</small>
          </article>
        ))}
      </div>

      <AssignManagerPanel tenant={tenant} />

      <section className="section-card feature-grid">
        {[
          ['Hotel profile', 'Branches, contact details, approval status, domains, and public listing.'],
          ['Branding customization', 'Logo, accent color, menu style, dark mode, typography, and tone.'],
          ['Menu management', 'Items, modifiers, photos, allergens, availability, pricing, and AI tags.'],
          ['Category management', 'Breakfast, lounge, room service, dietary collections, and seasonal menus.'],
          ['Table and room management', 'QR assignment, capacity, service zones, rooms, floors, and housekeeping state.'],
          ['Analytics dashboard', 'Orders, revenue, payments, feedback, discounts, and loyalty conversion.'],
        ].map(([title, description]) => (
          <article key={title} className="feature-tile">
            <strong>{title}</strong>
            <span>{description}</span>
          </article>
        ))}
      </section>

      <section className="section-card grid-2">
        <div>
          <div className="section-heading">
            <span className="eyebrow">Brand management</span>
            <h2>Theme and identity</h2>
          </div>
          <div className="feature-list">
            {brandingOptions.map((option) => (
              <div key={option}>{option}</div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-heading">
            <span className="eyebrow">Operations</span>
            <h2>Core hotel modules</h2>
          </div>
          <div className="feature-list">
            <div>Menu and category management</div>
            <div>Room and table reservation control</div>
            <div>Staff roster and schedule</div>
            <div>Guest feedback and loyalty</div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <span className="eyebrow">Promotions</span>
          <h2>Active marketing campaigns</h2>
        </div>
        <div className="promo-grid">
          {promotions.map((promo) => (
            <article key={promo.name} className="promo-card">
              <strong>{promo.name}</strong>
              <span>{promo.metric}</span>
              <small>{promo.status}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <span className="eyebrow">QR code management</span>
          <h2>Print-ready guest entry points</h2>
        </div>
        <div className="qr-builder-panel">
          <div>
            <strong>How hotel QR service works</strong>
            <span>
              Each printed code opens the same guest menu, but carries a table, room, or lounge
              token so orders arrive with the correct service location.
            </span>
          </div>
          <a className="primary-button" href={buildPrintCardUrl(tenant, 'table', 'qr-table-12-aster')}>
            Test table scan
          </a>
        </div>
        <div className="qr-management-grid">
          {qrLocations.map((item) => {
            const tenantToken = item.token.replace('aster', tenant.slug.split('-')[0] ?? 'hotel')
            const fullUrl = buildQrUrl(tenant, item.queryKey, tenantToken)
            const relativeUrl = buildPrintCardUrl(tenant, item.queryKey, tenantToken)

            return (
              <article key={item.token} className="qr-location-card">
                <div className="qr-print-card">
                  <QRCode data={fullUrl} label={`${item.label} QR code`} />
                  <strong>{tenant.name}</strong>
                  <span>{item.label}</span>
                </div>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.type}</span>
                  <span>{item.destination}</span>
                  <small>{item.status}</small>
                </div>
                <code>{fullUrl}</code>
                <div className="qr-actions">
                  <button type="button" onClick={() => copyQrUrl(fullUrl, item.token)}>
                    {copiedToken === item.token ? 'Copied link' : 'Copy link'}
                  </button>
                  <a href={relativeUrl} target="_blank" rel="noreferrer">
                    Open scan
                  </a>
                </div>
              </article>
            )
          })}
        </div>
        <div className="qr-flow">
          {[
            'Guest scans QR with phone camera.',
            'URL opens tenant menu with table or room token.',
            'Backend validates token and maps order to hotel, branch, table, or room.',
            'Guest selects language, orders, pays, and tracks kitchen status.',
          ].map((step, index) => (
            <div key={step} className="timeline-step is-complete">
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card grid-2">
        <div>
          <div className="section-heading">
            <span className="eyebrow">Kitchen monitoring</span>
            <h2>Service health</h2>
          </div>
          <div className="timeline">
            {['Order accepted', 'Kitchen active', 'Runner assigned', 'Guest notified'].map((step, index) => (
              <div key={step} className={index < 3 ? 'timeline-step is-complete' : 'timeline-step'}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="section-heading">
            <span className="eyebrow">Discounts and loyalty</span>
            <h2>Guest growth</h2>
          </div>
          <div className="feature-list">
            <div className="list-item"><strong>Gold member dinner</strong><span>15% automatic discount</span><small>Live</small></div>
            <div className="list-item"><strong>Birthday reward</strong><span>Free dessert with room order</span><small>Ready</small></div>
            <div className="list-item"><strong>Feedback recovery</strong><span>AI-triggered apology credit</span><small>Draft</small></div>
          </div>
        </div>
      </section>
    </div>
  )
}
