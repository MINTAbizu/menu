import type { Tenant } from '../types'

const serviceMetrics = [
  { label: 'Assigned tables', value: '12', detail: '4 need attention' },
  { label: 'Average response', value: '2m 18s', detail: 'Target under 4 minutes' },
  { label: 'Open orders', value: '21', detail: '7 ready for runner' },
  { label: 'Tips today', value: '$386', detail: '+14% versus last shift' },
]

const activeTables = [
  { table: 'T12', guests: 4, status: 'Preparing', total: '$62', note: 'Water requested' },
  { table: 'T04', guests: 2, status: 'Ready', total: '$32', note: 'Runner assigned' },
  { table: 'T21', guests: 6, status: 'Delivered', total: '$115', note: 'Dessert upsell' },
  { table: 'Lounge 3', guests: 3, status: 'Payment', total: '$74', note: 'Split bill' },
]

const waiterRequests = [
  { label: 'Need water', table: 'T12', eta: '2 min', priority: 'High' },
  { label: 'Request bill', table: 'T04', eta: '5 min', priority: 'Medium' },
  { label: 'Room cleaning', table: 'Room 406', eta: '8 min', priority: 'Low' },
  { label: 'Dietary question', table: 'T21', eta: 'Now', priority: 'High' },
]

export function WaiterDashboard({ tenant }: { tenant: Tenant }) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Waiter workspace</p>
          <h1>{tenant.name} floor service</h1>
          <p>
            See assigned tables, guest requests, runner handoffs, order status, payment actions,
            and service recovery cues without leaving the dining floor.
          </p>
        </div>
        <div className="qr-mini">
          <span>Shift score</span>
          <strong>94%</strong>
          <small>Guest satisfaction live estimate</small>
        </div>
      </div>

      <div className="metric-grid wide-grid">
        {serviceMetrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </div>

      <section className="section-card">
        <div className="section-heading">
          <span className="eyebrow">Floor overview</span>
          <h2>Active tables and room service</h2>
        </div>
        <div className="table-panel">
          <div className="table-header">
            <span>Location</span>
            <span>Guests</span>
            <span>Status</span>
            <span>Total</span>
            <span>Next action</span>
          </div>
          {activeTables.map((table) => (
            <div key={table.table} className="table-row">
              <span>{table.table}</span>
              <span>{table.guests}</span>
              <span>{table.status}</span>
              <span>{table.total}</span>
              <span>{table.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <span className="eyebrow">Guest requests</span>
          <h2>Prioritized service queue</h2>
        </div>
        <div className="request-grid">
          {waiterRequests.map((request) => (
            <article key={`${request.table}-${request.label}`} className="request-card">
              <span>{request.label}</span>
              <small>{request.table} / {request.priority}</small>
              <strong>{request.eta}</strong>
              <button type="button">Mark in progress</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
