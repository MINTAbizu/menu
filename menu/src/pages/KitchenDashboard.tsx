import type { Tenant } from '../types'

type KitchenOrder = {
  table: string
  item: string
  stage: string
  eta: string
  priority: string
}

const kitchenOrders: KitchenOrder[] = [
  { table: 'T12', item: 'Berbere Glazed Salmon', stage: 'Cooking', eta: '08:20', priority: 'High' },
  { table: 'Room 406', item: 'Garden Injera Tasting', stage: 'Preparing', eta: '12:00', priority: 'Medium' },
  { table: 'Lounge 3', item: 'Truffle Tibs Flatbread', stage: 'Ready', eta: '02:30', priority: 'Low' },
  { table: 'T18', item: 'Spiced Lamb Shiro', stage: 'Cooking', eta: '09:15', priority: 'High' },
]

export function KitchenDashboard({ tenant }: { tenant: Tenant }) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Kitchen command center</p>
          <h1>{tenant.name} kitchen dashboard</h1>
          <p>
            Monitor live prep status, prioritize orders, and keep the line moving with kitchen-ready metrics.
          </p>
        </div>
      </div>

      <section className="section-card">
        <div className="section-heading">
          <span className="eyebrow">Live queue</span>
          <h2>Kitchen order board</h2>
        </div>
        <div className="table-panel">
          <div className="table-header">
            <span>Table</span>
            <span>Item</span>
            <span>Status</span>
            <span>ETA</span>
            <span>Priority</span>
          </div>
          {kitchenOrders.map((order) => (
            <div key={`${order.table}-${order.item}`} className="table-row">
              <span>{order.table}</span>
              <span>{order.item}</span>
              <span>{order.stage}</span>
              <span>{order.eta}</span>
              <span className={`status-pill status-${order.priority.toLowerCase()}`}>{order.priority}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card grid-2">
        <div className="section-card compact-card">
          <div className="section-heading">
            <span className="eyebrow">Preparation flow</span>
            <h2>Stage overview</h2>
          </div>
          <div className="feature-list">
            <div>Received: incoming orders</div>
            <div>Preparing: ingredients in progress</div>
            <div>Cooking: active pans and flames</div>
            <div>Ready: plated and waiting pickup</div>
          </div>
        </div>
        <div className="section-card compact-card">
          <div className="section-heading">
            <span className="eyebrow">Priority tracker</span>
            <h2>Kitchen alerts</h2>
          </div>
          <div className="feature-list">
            <div>High priority delivery in 8 minutes</div>
            <div>Inventory low on premium spices</div>
            <div>Shift change in 18 minutes</div>
          </div>
        </div>
      </section>
    </div>
  )
}
