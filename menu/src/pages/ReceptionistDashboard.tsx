import type { Tenant } from '../types'

const arrivals = [
  { guest: 'Maya Johnson', room: '1204', source: 'Marriott Bonvoy', status: 'VIP arrival' },
  { guest: 'Henok Tesfaye', room: '808', source: 'Direct booking', status: 'Prepaid' },
  { guest: 'Claire Dubois', room: '512', source: 'Airbnb Luxe', status: 'Needs passport' },
]

const concierge = [
  { request: 'Airport transfer', guest: 'Maya Johnson', eta: '18 min' },
  { request: 'Anniversary setup', guest: 'Room 808', eta: '42 min' },
  { request: 'Spa reservation', guest: 'Claire Dubois', eta: 'Today 7:30 PM' },
]

export function ReceptionistDashboard({ tenant }: { tenant: Tenant }) {
  return (
    <div className="page-shell">
      <div className="page-header hero-panel">
        <div>
          <p className="eyebrow">Reception command</p>
          <h1>{tenant.name} front desk</h1>
          <p>
            Handle arrivals, concierge requests, room status, guest notes, and service recovery
            from a calm front-office workspace.
          </p>
        </div>
        <div className="qr-mini">
          <span>Room QR</span>
          <strong>512</strong>
          <small>Ready for guest menu and service requests</small>
        </div>
      </div>

      <div className="metric-grid wide-grid">
        {[
          { label: 'Arrivals today', value: '46' },
          { label: 'Checked in', value: '31' },
          { label: 'Open requests', value: '12' },
          { label: 'Available rooms', value: '18' },
        ].map((metric) => (
          <article key={metric.label} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>Front desk live status</small>
          </article>
        ))}
      </div>

      <section className="section-card grid-2">
        <div>
          <div className="section-heading">
            <span className="eyebrow">Arrival flow</span>
            <h2>Guest check-in queue</h2>
          </div>
          <div className="feature-list">
            {arrivals.map((arrival) => (
              <div key={arrival.guest} className="list-item">
                <strong>{arrival.guest}</strong>
                <span>{arrival.room} / {arrival.source}</span>
                <small>{arrival.status}</small>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-heading">
            <span className="eyebrow">Concierge</span>
            <h2>Service promises</h2>
          </div>
          <div className="feature-list">
            {concierge.map((item) => (
              <div key={item.request} className="list-item">
                <strong>{item.request}</strong>
                <span>{item.guest}</span>
                <small>{item.eta}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
