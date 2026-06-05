import type { Tenant } from '../types'

type KitchenOrder = {
  table: string
  item: string
  stage: string
  eta: string
  priority: string
  station: string
}

const kitchenOrders: KitchenOrder[] = [
  { table: 'T12', item: 'Berbere Glazed Salmon', stage: 'Cooking', eta: '08:20', priority: 'High', station: 'Grill' },
  { table: 'Room 406', item: 'Garden Injera Tasting', stage: 'Preparing', eta: '12:00', priority: 'Medium', station: 'Cold' },
  { table: 'Lounge 3', item: 'Truffle Tibs Flatbread', stage: 'Ready', eta: '02:30', priority: 'Low', station: 'Oven' },
  { table: 'T18', item: 'Spiced Lamb Shiro', stage: 'Cooking', eta: '09:15', priority: 'High', station: 'Hot line' },
]

const stations = [
  { name: 'Hot line', load: '86%', detail: '2 high priority orders' },
  { name: 'Grill', load: '71%', detail: 'Salmon batch finishing' },
  { name: 'Cold', load: '42%', detail: 'Prep capacity available' },
  { name: 'Pastry', load: '58%', detail: 'Dessert upsell ready' },
]

export function KitchenDashboard({ tenant }: { tenant: Tenant }) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Kitchen command center</p>
          <h1>{tenant.name} live kitchen</h1>
          <p>
            Monitor prep stages, station capacity, item timing, allergen notes, and runner pickup
            so guests see accurate live kitchen status.
          </p>
        </div>
        <div className="qr-mini">
          <span>Average prep</span>
          <strong>16m</strong>
          <small>4 minutes faster than target</small>
        </div>
      </div>

      <section className="section-card">
        <div className="section-heading">
          <span className="eyebrow">Live queue</span>
          <h2>Kitchen order board</h2>
        </div>
        <div className="table-panel">
          <div className="table-header">
            <span>Location</span>
            <span>Item</span>
            <span>Station</span>
            <span>Status</span>
            <span>ETA</span>
            <span>Priority</span>
          </div>
          {kitchenOrders.map((order) => (
            <div key={`${order.table}-${order.item}`} className="table-row">
              <span>{order.table}</span>
              <span>{order.item}</span>
              <span>{order.station}</span>
              <span>{order.stage}</span>
              <span>{order.eta}</span>
              <span className={`status-pill status-${order.priority.toLowerCase()}`}>{order.priority}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card grid-2">
        <div>
          <div className="section-heading">
            <span className="eyebrow">Station load</span>
            <h2>Line capacity</h2>
          </div>
          <div className="feature-list">
            {stations.map((station) => (
              <div key={station.name} className="list-item">
                <strong>{station.name}</strong>
                <span>{station.load} load</span>
                <small>{station.detail}</small>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="section-heading">
            <span className="eyebrow">Chef alerts</span>
            <h2>Action required</h2>
          </div>
          <div className="timeline">
            {['Allergen check', 'Plate quality', 'Runner pickup', 'Guest notified'].map((step, index) => (
              <div key={step} className={index < 2 ? 'timeline-step is-complete' : 'timeline-step'}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
