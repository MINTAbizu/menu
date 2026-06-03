import { useState, type FormEvent } from 'react'
import { createUser } from '../api'
import type { Tenant } from '../types'

const metrics = [
  { label: 'Total hotels', value: '138' },
  { label: 'Active subscriptions', value: '124' },
  { label: 'Platform MRR', value: '$278K' },
  { label: 'Total customers', value: '23,400' },
]

const approvalItems = [
  { hotel: 'Aster Grand Addis', status: 'Pending', owner: 'Mulugeta', plan: 'Enterprise' },
  { hotel: 'Marina Blue Resort', status: 'Approved', owner: 'Tsedey', plan: 'Resort Plus' },
  { hotel: 'Skyline Suites', status: 'Pending', owner: 'Ahmed', plan: 'Premium' },
]

const supportTickets = [
  { id: 'T-1041', subject: 'Payment processing issue', customer: 'Hotel Owner', status: 'Open' },
  { id: 'T-1042', subject: 'Tenant onboarding review', customer: 'Support', status: 'In progress' },
  { id: 'T-1043', subject: 'API key renewal', customer: 'Reception', status: 'Resolved' },
]

function AssignOwnerPanel({ tenant }: { tenant: Tenant }) {
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
        role: 'HOTEL_OWNER',
      })
      setMessage(`Owner ${response.user.fullName} created successfully.`)
      setEmail('')
      setFullName('')
      setPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create hotel owner')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="section-card">
      <div className="section-heading">
        <span className="eyebrow">Assign hotel owner</span>
        <h2>Create a new owner for this tenant</h2>
      </div>
      <form onSubmit={handleSubmit} className="user-form">
        <label>
          Full name
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} required placeholder="Owner name" />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="owner@example.com" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Create a secure password" />
        </label>
        {error ? <div className="alert">{error}</div> : null}
        {message ? <div className="status-message">{message}</div> : null}
        <button className="primary-button" type="submit" disabled={isSaving}>
          {isSaving ? 'Creating owner…' : 'Create owner'}
        </button>
      </form>
    </section>
  )
}

export function SuperAdminDashboard({ tenant }: { tenant: Tenant }) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Platform operations</p>
          <h1>Super Admin dashboard</h1>
          <p>
            Control the entire multi-tenant hospitality platform, review hotel approvals,
            monitor subscriptions, and broadcast system notifications.
          </p>
        </div>
      </div>

      <div className="metric-grid wide-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>Live platform insights</small>
          </article>
        ))}
      </div>

      <AssignOwnerPanel tenant={tenant} />

      <section className="section-card">
        <div className="section-heading">
          <span className="eyebrow">Hotel approvals</span>
          <h2>Onboarding queue</h2>
        </div>
        <div className="table-panel">
          <div className="table-header">
            <span>Hotel</span>
            <span>Owner</span>
            <span>Plan</span>
            <span>Status</span>
          </div>
          {approvalItems.map((item) => (
            <div key={item.hotel} className="table-row">
              <span>{item.hotel}</span>
              <span>{item.owner}</span>
              <span>{item.plan}</span>
              <span className={`status-pill status-${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card grid-2">
        <div className="table-panel">
          <div className="section-heading">
            <span className="eyebrow">System monitoring</span>
            <h2>Support tickets</h2>
          </div>
          {supportTickets.map((ticket) => (
            <div key={ticket.id} className="table-row">
              <span>{ticket.id}</span>
              <span>{ticket.subject}</span>
              <span>{ticket.customer}</span>
              <span className={`status-pill status-${ticket.status.toLowerCase().replace(' ', '-')}`}>{ticket.status}</span>
            </div>
          ))}
        </div>
        <div className="section-card compact-card">
          <div className="section-heading">
            <span className="eyebrow">Tenant insight</span>
            <h2>Selected tenant</h2>
          </div>
          <div className="detail-list">
            <div>
              <strong>Hotel</strong>
              <span>{tenant.name}</span>
            </div>
            <div>
              <strong>Plan</strong>
              <span>{tenant.plan}</span>
            </div>
            <div>
              <strong>Tenant slug</strong>
              <span>{tenant.slug}</span>
            </div>
            <div>
              <strong>Brand accent</strong>
              <span>{tenant.accent}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
