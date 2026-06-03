import { useState, type FormEvent } from 'react'
import { createUser } from '../api'
import type { Tenant } from '../types'

const ownerMetrics = [
  { label: 'Menu items', value: '72' },
  { label: 'Active tables', value: '48' },
  { label: 'Monthly revenue', value: '$45K' },
  { label: 'Guest CSAT', value: '94%' },
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

function AssignManagerPanel({ tenant }: { tenant: Tenant }) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setError(null)
    setIsSaving(true)

    try {
      const response = await createUser(tenant.slug, {
        email,
        fullName,
        password,
        role: 'HOTEL_MANAGER',
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
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Create a secure password" />
        </label>
        {error ? <div className="alert">{error}</div> : null}
        {message ? <div className="status-message">{message}</div> : null}
        <button className="primary-button" type="submit" disabled={isSaving}>
          {isSaving ? 'Creating manager…' : 'Create manager'}
        </button>
      </form>
    </section>
  )
}

export function HotelOwnerDashboard({ tenant }: { tenant: Tenant }) {
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

      <section className="section-card grid-2">
        <div className="section-card compact-card">
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

        <div className="section-card compact-card">
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
    </div>
  )
}
