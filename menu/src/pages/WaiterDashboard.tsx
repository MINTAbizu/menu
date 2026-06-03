import type { Tenant } from '../types'

const activeTables = [
  { table: 'T12', guests: 4, status: 'Preparing', total: '$62' },
  { table: 'T04', guests: 2, status: 'Ready', total: '$32' },
  { table: 'T21', guests: 6, status: 'Delivered', total: '$115' },
]

const waiterRequests = [
  { label: 'Need water', table: 'T12', eta: '2 min' },
  { label: 'Request bill', table: 'T04', eta: '5 min' },
  { label: 'Room cleaning', table: 'Room 406', eta: '8 min' },
]

export function WaiterDashboard({ tenant }: { tenant: Tenant }) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Waiter workspace</p>
          <h1>{tenant.name} service dashboard</h1>
          <p>
            Keep table service smooth with live requests, active order tracking, and kitchen coordination.
          </p>
        </div>
      </div>

      <section className="section-card">
        <div className="section-heading">
          <span className="eyebrow">Floor overview</span>
          <h2>Active tables</h2>
        </div>
        <div className="table-panel">
          <div className="table-header">
            <span>Table</span>
            <span>Guests</span>
            <span>Status</span>
            <span>Total</span>
          </div>
          {activeTables.map((table) => (
            <div key={table.table} className="table-row">
              <span>{table.table}</span>
              <span>{table.guests}</span>
              <span>{table.status}</span>
              <span>{table.total}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <span className="eyebrow">Guest requests</span>
          <h2>Immediate service</h2>
        </div>
        <div className="request-grid">
          {waiterRequests.map((request) => (
            <article key={request.label} className="request-card">
              <span>{request.label}</span>
              <small>{request.table}</small>
              <strong>{request.eta}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
