import { useState, type FormEvent } from 'react'
import { createUser } from '../api'
import type { AssignableRole, Tenant } from '../types'

const managerMetrics = [
  { label: 'Live rooms', value: '18' },
  { label: 'Housekeeping', value: '12 active' },
  { label: 'Check-ins today', value: '34' },
  { label: 'Service requests', value: '14' },
]

const teamStatus = [
  { name: 'Waiters', count: 16, status: 'Ready' },
  { name: 'Kitchen', count: 8, status: 'Busy' },
  { name: 'Front desk', count: 4, status: 'Available' },
]

const reservations = [
  { guest: 'Samuel Joseph', room: '401', status: 'Confirmed', arrival: '18:00' },
  { guest: 'Lily Bekele', room: '212', status: 'Pending', arrival: '19:20' },
  { guest: 'Ahmed Mohamed', room: '503', status: 'Checked in', arrival: '14:30' },
]

const staffOptions: AssignableRole[] = ['WAITER', 'KITCHEN_STAFF', 'RECEPTIONIST']

function AssignStaffPanel({ tenant }: { tenant: Tenant }) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<AssignableRole>('WAITER')
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
        role,
      })

      setMessage(`${response.user.fullName} created as ${response.user.role.replace('_', ' ').toLowerCase()}.`)
      setEmail('')
      setFullName('')
      setPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create staff member')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="section-card">
      <div className="section-heading">
        <span className="eyebrow">Assign staff</span>
        <h2>Enable team members for guest service</h2>
      </div>
      <form onSubmit={handleSubmit} className="user-form">
        <label>
          Full name
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} required placeholder="Staff name" />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="staff@example.com" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Create a secure password" />
        </label>
        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value as AssignableRole)}>
            {staffOptions.map((option) => (
              <option key={option} value={option}>{option.replace('_', ' ')}</option>
            ))}
          </select>
        </label>
        {error ? <div className="alert">{error}</div> : null}
        {message ? <div className="status-message">{message}</div> : null}
        <button className="primary-button" type="submit" disabled={isSaving}>
          {isSaving ? 'Creating staff…' : 'Create staff'}
        </button>
      </form>
    </section>
  )
}

export function HotelManagerDashboard({ tenant }: { tenant: Tenant }) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Hotel manager console</p>
          <h1>{tenant.name} manager dashboard</h1>
          <p>
            Coordinate hotel operations, staff performance, reservation flow, and guest service
            status from the management view.
          </p>
        </div>
      </div>

      <div className="metric-grid wide-grid">
        {managerMetrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>Operational visibility</small>
          </article>
        ))}
      </div>

      <AssignStaffPanel tenant={tenant} />

      <section className="section-card grid-2">
        <div className="section-card compact-card">
          <div className="section-heading">
            <span className="eyebrow">Team status</span>
            <h2>Staff capacity</h2>
          </div>
          <div className="feature-list">
            {teamStatus.map((item) => (
              <div key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.count} members · {item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card compact-card">
          <div className="section-heading">
            <span className="eyebrow">Reservation pipeline</span>
            <h2>Guest arrivals</h2>
          </div>
          <div className="feature-list">
            {reservations.map((reservation) => (
              <div key={reservation.guest}>
                <strong>{reservation.guest}</strong>
                <span>{reservation.room} • {reservation.status} • {reservation.arrival}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
