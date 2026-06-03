import type { Tenant } from '../types'

const orderHistory = [
  { id: 'ORD-9421', title: 'Breakfast in room', status: 'Delivered', total: '$38' },
  { id: 'ORD-9388', title: 'Lobby dinner', status: 'Paid', total: '$86' },
  { id: 'ORD-9304', title: 'Poolside drinks', status: 'Earned points', total: '$24' },
]

export function GuestDashboard({ tenant }: { tenant: Tenant }) {
  return (
    <div className="page-shell">
      <div className="page-header hero-panel">
        <div>
          <p className="eyebrow">Guest profile</p>
          <h1>Your {tenant.name} stay</h1>
          <p>
            Track room service, loyalty points, live orders, table requests, payments, and personal
            dining history in one guest portal.
          </p>
        </div>
        <div className="loyalty-ring">
          <span>Points</span>
          <strong>8,420</strong>
          <small>Gold tier</small>
        </div>
      </div>

      <section className="section-card">
        <div className="section-heading">
          <span className="eyebrow">Live order</span>
          <h2>Kitchen tracking</h2>
        </div>
        <div className="timeline">
          {['Order received', 'Chef preparing', 'Quality check', 'On the way'].map((step, index) => (
            <div key={step} className={index < 2 ? 'timeline-step is-complete' : 'timeline-step'}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card grid-2">
        <div>
          <div className="section-heading">
            <span className="eyebrow">Order history</span>
            <h2>Recent dining</h2>
          </div>
          <div className="feature-list">
            {orderHistory.map((order) => (
              <div key={order.id} className="list-item">
                <strong>{order.title}</strong>
                <span>{order.id} / {order.status}</span>
                <small>{order.total}</small>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-heading">
            <span className="eyebrow">Service</span>
            <h2>Quick requests</h2>
          </div>
          <div className="request-grid">
            {['Call waiter', 'Room service', 'Request bill', 'Add feedback'].map((action) => (
              <button key={action} type="button">{action}</button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
