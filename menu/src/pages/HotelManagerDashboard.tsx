import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import { createUser, getManagerDashboard, type ManagerDashboardData } from '../api'
import { PasswordStrength } from '../components/PasswordStrength'
import {
  loadGuestExperience,
  saveGuestExperience,
  type HotelGuestExperience,
} from '../hotelExperience'
import { QRCode } from '../components/QRCode'
import { isStrongPassword } from '../passwordPolicy'
import type { AssignableRole, Tenant } from '../types'

const managerMetrics = [
  { label: 'Occupancy Rate', value: '72%', detail: '+6% from yesterday', tone: 'violet' },
  { label: "Today's Check-in", value: '18', detail: '+3 from yesterday', tone: 'green' },
  { label: "Today's Check-out", value: '12', detail: '-2 from yesterday', tone: 'red' },
  { label: 'Available Rooms', value: '26', detail: '+5 from yesterday', tone: 'mint' },
  { label: "Today's Revenue", value: '$8,540.00', detail: '+12.5% from yesterday', tone: 'blue' },
]

const operatingPlan = [
  { area: 'Breakfast service', owner: 'Waiter team A', status: 'On pace', detail: '64 covers served, 12 active tables' },
  { area: 'Room turnover', owner: 'Housekeeping', status: 'Watch', detail: '5 suites blocked for inspection' },
  { area: 'Airport arrivals', owner: 'Reception', status: 'Ready', detail: '3 transfers in progress' },
  { area: 'Kitchen load', owner: 'Chef station 2', status: 'Busy', detail: '18-minute average prep time' },
]

const reservations = [
  { id: '#R12345', guest: 'Emma Johnson', room: 'Deluxe 204', checkIn: '24 May', checkOut: '26 May', status: 'Confirmed', amount: '$240.00' },
  { id: '#R12344', guest: 'Michael Brown', room: 'Suite 502', checkIn: '24 May', checkOut: '25 May', status: 'Checked-in', amount: '$350.00' },
  { id: '#R12343', guest: 'Sophia Davis', room: 'Standard 109', checkIn: '24 May', checkOut: '27 May', status: 'Confirmed', amount: '$120.00' },
  { id: '#R12342', guest: 'James Wilson', room: 'Deluxe 305', checkIn: '24 May', checkOut: '24 May', status: 'Checked-out', amount: '$220.00' },
  { id: '#R12341', guest: 'Olivia Martinez', room: 'Suite 608', checkIn: '25 May', checkOut: '28 May', status: 'Confirmed', amount: '$400.00' },
]

const roomStatus = [
  { label: 'Occupied', value: 68, color: '#5b4bff' },
  { label: 'Available', value: 26, color: '#2fc990' },
  { label: 'Cleaning', value: 12, color: '#ffd15c' },
  { label: 'Maintenance', value: 8, color: '#ff6b6b' },
  { label: 'Out of Order', value: 6, color: '#9a9cf7' },
]

const rooms = [
  { room: '101', type: 'Standard', floor: '1', status: 'Occupied', rate: '$120.00' },
  { room: '102', type: 'Deluxe', floor: '1', status: 'Available', rate: '$150.00' },
  { room: '103', type: 'Suite', floor: '1', status: 'Cleaning', rate: '$300.00' },
  { room: '104', type: 'Standard', floor: '1', status: 'Maintenance', rate: '$110.00' },
  { room: '105', type: 'Deluxe', floor: '1', status: 'Available', rate: '$150.00' },
]

const menuCategories = [
  ['Breakfast', '12', 'Active'],
  ['Starters', '10', 'Active'],
  ['Main Course', '18', 'Active'],
  ['Beverages', '15', 'Active'],
  ['Desserts', '8', 'Active'],
]

const menuItems = [
  ['Grilled Chicken', 'Main Course', '$15.00', 'Active'],
  ['Beef Steak', 'Main Course', '$23.00', 'Active'],
  ['Fish & Chips', 'Main Course', '$18.00', 'Active'],
  ['Pasta Alfredo', 'Main Course', '$14.00', 'Active'],
  ['Vegetable Curry', 'Main Course', '$12.00', 'Active'],
]

const orders = [
  ['#ORD1254', 'Table 05', '3 items', '$35.00', 'Confirmed'],
  ['#ORD1253', 'Table 02', '2 items', '$22.00', 'Preparing'],
  ['#ORD1252', 'Room 101', '4 items', '$42.00', 'On The Way'],
  ['#ORD1251', 'Table 08', '1 item', '$8.00', 'Delivered'],
  ['#ORD1250', 'Room 205', '3 items', '$30.00', 'Confirmed'],
]

const kitchenTickets = [
  { id: '#ORD1254', table: 'Table 05', eta: '8 min', items: ['Grilled Chicken', 'Pasta Alfredo', 'Fresh Mojito'], status: 'Cooking' },
  { id: '#ORD1253', table: 'Table 02', eta: '12 min', items: ['Chicken Soup', 'Caesar Salad'], status: 'Preparing' },
  { id: '#ORD1252', table: 'Room 101', eta: '20 min', items: ['Beef Steak', 'French Fries', 'Cola'], status: 'Queued' },
]

const roomService = [
  ['#RS124', 'Room 101', '3 items', '12:45 PM', 'New'],
  ['#RS123', 'Room 205', '2 items', '01:08 PM', 'In Progress'],
  ['#RS122', 'Room 302', '4 items', '01:10 PM', 'Completed'],
  ['#RS121', 'Room 105', '1 item', '01:15 PM', 'New'],
]

const guestFlow = ['Scan QR Code', 'View Menu', 'Add to Cart', 'Place Order', 'Order Confirmed', 'Track Order']

const staffOptions: AssignableRole[] = ['WAITER', 'KITCHEN_STAFF', 'RECEPTIONIST']

const managerNavItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'reservations', label: 'Reservations' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'qr-menu', label: 'QR Menu' },
  { id: 'orders', label: 'Orders' },
  { id: 'kitchen', label: 'Kitchen Display' },
  { id: 'service', label: 'Room Service' },
  { id: 'users', label: 'Users & Roles' },
] as const

type ManagerNavId = (typeof managerNavItems)[number]['id']

function formatDateTime(value?: string) {
  if (!value) return 'Not scheduled'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function locationLabel(item: {
  tableId?: { label?: string } | null
  roomId?: { number?: string } | null
}) {
  if (item.tableId?.label) return item.tableId.label
  if (item.roomId?.number) return `Room ${item.roomId.number}`
  return 'Unassigned'
}

function EmptyManagerState({ label }: { label: string }) {
  return <div className="manager-empty-state">No {label} found in the database yet.</div>
}

function ManagerDataSection({
  activeSection,
  data,
}: {
  activeSection: ManagerNavId
  data: ManagerDashboardData
}) {
  if (activeSection === 'reservations') {
    return (
      <article className="manager-panel table-card dynamic-manager-panel">
        <div className="manager-panel-head"><h2>Reservations from database</h2></div>
        {data.reservations.length ? (
          <table>
            <thead><tr><th>Guest</th><th>Contact</th><th>Date</th><th>Party</th><th>Notes</th></tr></thead>
            <tbody>
              {data.reservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.guestName}</td>
                  <td>{reservation.email ?? reservation.phone ?? 'No contact'}</td>
                  <td>{formatDateTime(reservation.startsAt)}</td>
                  <td>{reservation.partySize}</td>
                  <td>{reservation.notes ?? 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <EmptyManagerState label="reservations" />}
      </article>
    )
  }

  if (activeSection === 'rooms') {
    return (
      <article className="manager-panel table-card dynamic-manager-panel">
        <div className="manager-panel-head"><h2>Rooms from database</h2></div>
        {data.rooms.length ? (
          <table>
            <thead><tr><th>Room</th><th>Floor</th><th>QR Token</th><th>Status</th></tr></thead>
            <tbody>
              {data.rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.number}</td>
                  <td>{room.floor ?? 'Main'}</td>
                  <td>{room.qrToken}</td>
                  <td><span className={`table-status ${room.isActive ? 'confirmed' : 'cancelled'}`}>{room.isActive ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <EmptyManagerState label="rooms" />}
      </article>
    )
  }

  if (activeSection === 'qr-menu') {
    return (
      <section className="manager-qr-grid dynamic-manager-panel">
        <article className="manager-panel table-card">
          <div className="manager-panel-head"><h2>Menu categories from database</h2></div>
          {data.categories.length ? (
            <table>
              <thead><tr><th>#</th><th>Category</th><th>Items</th><th>Status</th></tr></thead>
              <tbody>
                {data.categories.map((category, index) => (
                  <tr key={category._id}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>{data.menuItems.filter((item) => String(item.categoryId) === String(category._id)).length}</td>
                    <td><span className={`table-status ${category.isActive ? 'confirmed' : 'cancelled'}`}>{category.isActive ? 'Active' : 'Hidden'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <EmptyManagerState label="menu categories" />}
        </article>
        <article className="manager-panel table-card">
          <div className="manager-panel-head"><h2>Menu items from database</h2></div>
          {data.menuItems.length ? (
            <table>
              <thead><tr><th>Item</th><th>Price</th><th>Prep</th><th>Status</th></tr></thead>
              <tbody>
                {data.menuItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{formatMoney(item.price)}</td>
                    <td>{item.prepMinutes ?? 15} min</td>
                    <td><span className={`table-status ${item.isAvailable ? 'confirmed' : 'cancelled'}`}>{item.isAvailable ? 'Available' : 'Hidden'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <EmptyManagerState label="menu items" />}
        </article>
      </section>
    )
  }

  if (activeSection === 'orders' || activeSection === 'kitchen') {
    const source = activeSection === 'kitchen' ? data.kitchenOrders : data.orders
    return (
      <article className="manager-panel table-card dynamic-manager-panel">
        <div className="manager-panel-head"><h2>{activeSection === 'kitchen' ? 'Kitchen orders' : 'Orders'} from database</h2></div>
        {source.length ? (
          <table>
            <thead><tr><th>Location</th><th>Items</th><th>Total</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>
              {source.map((order) => (
                <tr key={order._id}>
                  <td>{locationLabel(order)}</td>
                  <td>{order.items.map((item) => `${item.quantity}x ${item.nameSnapshot}`).join(', ')}</td>
                  <td>{formatMoney(order.total)}</td>
                  <td><span className={`table-status ${order.status.toLowerCase()}`}>{order.status.replaceAll('_', ' ')}</span></td>
                  <td>{formatDateTime(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <EmptyManagerState label="orders" />}
      </article>
    )
  }

  if (activeSection === 'service') {
    return (
      <article className="manager-panel table-card dynamic-manager-panel">
        <div className="manager-panel-head"><h2>Service requests from database</h2></div>
        {data.serviceRequests.length ? (
          <table>
            <thead><tr><th>Location</th><th>Type</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>
              {data.serviceRequests.map((request) => (
                <tr key={request._id}>
                  <td>{locationLabel(request)}</td>
                  <td>{request.type.replaceAll('_', ' ')}</td>
                  <td><span className={`table-status ${request.isOpen ? 'new' : 'completed'}`}>{request.isOpen ? 'Open' : 'Closed'}</span></td>
                  <td>{formatDateTime(request.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <EmptyManagerState label="service requests" />}
      </article>
    )
  }

  if (activeSection === 'users') {
    return (
      <article className="manager-panel table-card dynamic-manager-panel">
        <div className="manager-panel-head"><h2>Users and roles from database</h2></div>
        {data.users.length ? (
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role.replaceAll('_', ' ')}</td>
                  <td><span className={`table-status ${user.isActive ? 'confirmed' : 'cancelled'}`}>{user.isActive ? 'Active' : 'Disabled'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <EmptyManagerState label="users" />}
      </article>
    )
  }

  return null
}

function AssignStaffPanel({ tenant }: { tenant: Tenant }) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<AssignableRole>('WAITER')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const canSubmit = Boolean(email.trim() && fullName.trim().length >= 3 && isStrongPassword(password))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setError(null)

    if (!canSubmit) {
      setError('Complete all fields and use a strong password before creating staff access.')
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
        <span className="eyebrow">Team provisioning</span>
        <h2>Create scoped staff access</h2>
      </div>
      <form onSubmit={handleSubmit} className="user-form compact-form">
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
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Create a strong password" autoComplete="new-password" />
        </label>
        <PasswordStrength password={password} />
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
        <button className="primary-button" type="submit" disabled={isSaving || !canSubmit}>
          {isSaving ? 'Creating staff...' : 'Create staff'}
        </button>
      </form>
    </section>
  )
}

function GuestExperienceSettings({ tenant }: { tenant: Tenant }) {
  const [settings, setSettings] = useState<HotelGuestExperience>(() => loadGuestExperience(tenant.slug))
  const [message, setMessage] = useState<string | null>(null)

  const updateSetting = <Key extends keyof HotelGuestExperience>(
    key: Key,
    value: HotelGuestExperience[Key],
  ) => {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  const toggleService = (serviceId: string) => {
    setSettings((current) => ({
      ...current,
      services: current.services.map((service) =>
        service.id === serviceId ? { ...service, enabled: !service.enabled } : service,
      ),
    }))
  }

  const toggleCategory = (categoryId: string) => {
    setSettings((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category._id === categoryId ? { ...category, enabled: !category.enabled } : category,
      ),
    }))
  }

  const toggleItem = (categoryId: string, itemId: string) => {
    setSettings((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category._id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item._id === itemId ? { ...item, available: !item.available } : item,
              ),
            }
          : category,
      ),
    }))
  }

  const saveSettings = () => {
    saveGuestExperience(tenant.slug, settings)
    setMessage('Guest QR experience saved. Open the guest menu to preview the updated view.')
    window.setTimeout(() => setMessage(null), 2600)
  }

  return (
    <section className="section-card manager-settings">
      <div className="section-heading">
        <span className="eyebrow">Guest QR experience settings</span>
        <h2>Control what guests see after scanning</h2>
      </div>

      <div className="settings-grid">
        <label>
          Welcome title
          <input
            value={settings.welcomeTitle}
            onChange={(event) => updateSetting('welcomeTitle', event.target.value)}
          />
        </label>
        <label>
          Hotel mood
          <select
            value={settings.hotelMood}
            onChange={(event) => updateSetting('hotelMood', event.target.value)}
          >
            {['Luxury comfort', 'Business calm', 'Resort lounge', 'Family friendly'].map((mood) => (
              <option key={mood} value={mood}>{mood}</option>
            ))}
          </select>
        </label>
        <label className="settings-wide">
          Welcome message
          <textarea
            value={settings.welcomeMessage}
            onChange={(event) => updateSetting('welcomeMessage', event.target.value)}
          />
        </label>
      </div>

      <div className="manager-toggle-row">
        <label>
          <input
            type="checkbox"
            checked={settings.showNutrition}
            onChange={(event) => updateSetting('showNutrition', event.target.checked)}
          />
          Show nutrition and allergens
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.showServiceEta}
            onChange={(event) => updateSetting('showServiceEta', event.target.checked)}
          />
          Show service time estimates
        </label>
      </div>

      <div className="section-heading compact-heading">
        <span className="eyebrow">Services</span>
        <h2>Guest service categories</h2>
      </div>
      <div className="service-config-grid">
        {settings.services.map((service) => (
          <article key={service.id} className={service.enabled ? 'service-config-card is-on' : 'service-config-card'}>
            <div>
              <strong>{service.name}</strong>
              <span>{service.category} / {service.eta}</span>
              <small>{service.description}</small>
            </div>
            <button type="button" onClick={() => toggleService(service.id)}>
              {service.enabled ? 'Visible' : 'Hidden'}
            </button>
          </article>
        ))}
      </div>

      <div className="section-heading compact-heading">
        <span className="eyebrow">Menu and services</span>
        <h2>Food, drink, and request categories</h2>
      </div>
      <div className="category-config-list">
        {settings.categories.map((category) => (
          <article key={category._id} className="category-config-card">
            <div className="category-config-header">
              <div>
                <strong>{category.name}</strong>
                <span>{category.kind} / {category.description}</span>
              </div>
              <button type="button" onClick={() => toggleCategory(category._id)}>
                {category.enabled ? 'Category visible' : 'Category hidden'}
              </button>
            </div>
            <div className="item-config-grid">
              {category.items.map((item) => (
                <div key={item._id} className="item-config-row">
                  <span>{item.name}</span>
                  <small>
                    {settings.defaultCurrency}{item.price} / {item.serviceWindow ?? 'Any time'}
                  </small>
                  <button type="button" onClick={() => toggleItem(category._id, item._id)}>
                    {item.available === false ? 'Unavailable' : 'Available'}
                  </button>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {message ? <div className="status-message">{message}</div> : null}
      <button className="primary-button" type="button" onClick={saveSettings}>
        Save guest QR settings
      </button>
    </section>
  )
}

export function HotelManagerDashboard({ tenant }: { tenant: Tenant }) {
  const qrUrl = `${window.location.origin}/hotel/${tenant.slug}/menu?table=05`
  const [activeSection, setActiveSection] = useState<ManagerNavId>('dashboard')
  const [dashboardData, setDashboardData] = useState<ManagerDashboardData | null>(null)
  const [dashboardError, setDashboardError] = useState<string | null>(null)
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setDashboardLoading(true)
    setDashboardError(null)

    getManagerDashboard(tenant.slug)
      .then((data) => {
        if (isMounted) {
          setDashboardData(data)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setDashboardError(err instanceof Error ? err.message : 'Failed to load manager dashboard')
        }
      })
      .finally(() => {
        if (isMounted) {
          setDashboardLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [tenant.slug])

  const dynamicMetrics = dashboardData
    ? [
        { label: 'Reservations', value: String(dashboardData.summary.reservations), detail: 'Loaded from database', tone: 'violet' },
        { label: 'Active Orders', value: String(dashboardData.summary.activeOrders), detail: 'Kitchen and service flow', tone: 'green' },
        { label: 'Rooms', value: String(dashboardData.summary.rooms), detail: `${dashboardData.summary.availableRooms} active`, tone: 'mint' },
        { label: 'Menu Items', value: String(dashboardData.summary.menuItems), detail: `${dashboardData.summary.tables} QR tables`, tone: 'blue' },
        { label: 'Open Requests', value: String(dashboardData.summary.openServiceRequests), detail: `${dashboardData.summary.users} user accounts`, tone: 'red' },
      ]
    : managerMetrics

  return (
    <div className="manager-page">
      <div className="manager-desktop">
        <aside className="manager-rail" aria-label="Hotel manager navigation">
          <div className="manager-brand">
            <span>{tenant.logoMark}</span>
            <div>
              <strong>Royal Hotel</strong>
              <small>Admin Panel</small>
            </div>
          </div>
          <nav>
            {managerNavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === activeSection ? 'active' : ''}
                onClick={() => setActiveSection(item.id)}
              >
                <span>{item.label.slice(0, 1)}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="manager-profile">
            <span>AD</span>
            <div>
              <strong>Admin</strong>
              <small>Super Administrator</small>
            </div>
          </div>
        </aside>

        <main className="manager-canvas">
          <header className="manager-top">
            <div>
              <button type="button" aria-label="Open navigation">=</button>
              <strong>Dashboard</strong>
            </div>
            <div className="manager-top-actions">
              <button type="button">Today, 24 May 2024</button>
              <button type="button" aria-label="Search">S</button>
              <button type="button" aria-label="Notifications">N</button>
              <span>AD</span>
            </div>
          </header>

          <section className="manager-kpis" aria-label="Manager KPIs">
            {dynamicMetrics.map((metric) => (
              <article key={metric.label} className={`manager-kpi ${metric.tone}`}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.detail}</small>
              </article>
            ))}
          </section>

          {dashboardError ? <div className="alert">{dashboardError}</div> : null}
          {dashboardLoading ? <div className="manager-empty-state">Loading manager data...</div> : null}
          {!dashboardLoading && dashboardData && activeSection !== 'dashboard' ? (
            <ManagerDataSection activeSection={activeSection} data={dashboardData} />
          ) : null}

          {activeSection === 'dashboard' ? <section className="manager-main-grid">
            <article className="manager-panel room-status-panel" id="manager-rooms">
              <div className="manager-panel-head">
                <h2>Room Status</h2>
                <span>Total Rooms <strong>120</strong></span>
              </div>
              <div className="room-status-body">
                <div className="donut-chart" aria-label="Room status chart" />
                <div className="status-legend">
                  {roomStatus.map((status) => (
                    <span key={status.label} style={{ '--dot': status.color } as CSSProperties}>
                      {status.label} <b>{status.value}</b>
                    </span>
                  ))}
                </div>
              </div>
              <button type="button">View All Rooms</button>
            </article>

            <article className="manager-panel recent-reservations">
              <div className="manager-panel-head">
                <h2>Recent Reservations</h2>
                <a href="#manager-reservations">View All</a>
              </div>
              {reservations.slice(0, 4).map((reservation) => (
                <div key={reservation.id} className="reservation-strip">
                  <span>{reservation.guest.split(' ').map((part) => part[0]).join('')}</span>
                  <div>
                    <strong>{reservation.guest}</strong>
                    <small>{reservation.room}</small>
                  </div>
                  <small>Check-in<br />{reservation.checkIn}</small>
                  <small>Check-out<br />{reservation.checkOut}</small>
                  <em>{reservation.status}</em>
                </div>
              ))}
            </article>

            <article className="manager-panel revenue-panel">
              <div className="manager-panel-head">
                <h2>Revenue Overview</h2>
                <button type="button">This Week</button>
              </div>
              <strong className="big-number">$42,570.00</strong>
              <small className="positive">+15.9% from last week</small>
              <div className="line-chart">
                {[42, 58, 52, 66, 88, 63, 92].map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
            </article>
          </section> : null}

          {activeSection === 'dashboard' ? <section className="manager-actions" aria-label="Quick actions">
            {['New Reservation', 'Walk-in Check-in', 'Add Guest', 'Room Availability', 'Housekeeping', 'Maintenance', 'Add Expense'].map((action) => (
              <button key={action} type="button">
                <span>{action.slice(0, 1)}</span>
                {action}
              </button>
            ))}
          </section> : null}

          {activeSection === 'dashboard' ? <section className="manager-wide-grid">
            <article className="manager-panel table-card" id="manager-reservations">
              <div className="manager-panel-head">
                <h2>Reservations</h2>
                <button type="button">+ New Reservation</button>
              </div>
              <div className="mini-tabs"><span className="active">All</span><span>Confirmed</span><span>Checked-in</span><span>Cancelled</span></div>
              <table>
                <thead>
                  <tr><th>Booking ID</th><th>Guest Name</th><th>Room Details</th><th>Check-in</th><th>Status</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>{reservation.id}</td><td>{reservation.guest}</td><td>{reservation.room}</td><td>{reservation.checkIn}</td>
                      <td><span className={`table-status ${reservation.status.toLowerCase().replace('-', '')}`}>{reservation.status}</span></td>
                      <td>{reservation.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            <article className="manager-panel table-card" id="manager-room-management">
              <div className="manager-panel-head">
                <h2>Room Management</h2>
                <button type="button">+ Add Room</button>
              </div>
              <div className="room-summary">
                {['120 Total', '68 Occupied', '26 Available', '12 Cleaning', '8 Maintenance', '6 Out of Order'].map((item) => <span key={item}>{item}</span>)}
              </div>
              <table>
                <thead>
                  <tr><th>Room No.</th><th>Room Type</th><th>Floor</th><th>Status</th><th>Rate/Night</th></tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.room}>
                      <td>{room.room}</td><td>{room.type}</td><td>{room.floor}</td>
                      <td><span className={`table-status ${room.status.toLowerCase().replaceAll(' ', '')}`}>{room.status}</span></td>
                      <td>{room.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </section> : null}

          {activeSection === 'dashboard' ? <section className="manager-qr-grid" id="manager-qr-menu">
            <article className="manager-panel table-card">
              <div className="manager-panel-head"><h2>QR Menu - Menu Categories</h2><button type="button">+ Add Category</button></div>
              <table><thead><tr><th>#</th><th>Category Name</th><th>Items</th><th>Status</th></tr></thead><tbody>
                {menuCategories.map(([name, items, status], index) => <tr key={name}><td>{index + 1}</td><td>{name}</td><td>{items}</td><td><span className="table-status confirmed">{status}</span></td></tr>)}
              </tbody></table>
            </article>
            <article className="manager-panel table-card">
              <div className="manager-panel-head"><h2>Menu Items - Main Course</h2><button type="button">+ Add Item</button></div>
              <table><thead><tr><th>#</th><th>Item Name</th><th>Category</th><th>Price</th><th>Status</th></tr></thead><tbody>
                {menuItems.map(([name, category, price, status], index) => <tr key={name}><td>{index + 1}</td><td>{name}</td><td>{category}</td><td>{price}</td><td><span className="table-status confirmed">{status}</span></td></tr>)}
              </tbody></table>
            </article>
            <article className="manager-panel qr-code-panel">
              <div className="manager-panel-head"><h2>QR Code - Table 05</h2><button type="button">+ Generate QR</button></div>
              <strong>Table 05</strong>
              <QRCode data={qrUrl} label="Table 05 guest menu QR code" size={168} />
              <small>Scan QR code to view menu and place order</small>
              <div><button type="button">Download QR</button><button type="button">Print QR</button></div>
            </article>
          </section> : null}

          {activeSection === 'dashboard' ? <section className="manager-flow manager-panel">
            <div className="manager-panel-head"><h2>QR Menu - Guest Flow</h2></div>
            <div className="flow-phones">
              {guestFlow.map((step, index) => (
                <article key={step} className="phone-mock">
                  <span>{index + 1}. {step}</span>
                  <div className={index === 0 ? 'phone-qr' : ''}>{index === 0 ? <QRCode data={qrUrl} label="Guest flow QR preview" size={86} /> : <strong>{step}</strong>}</div>
                </article>
              ))}
            </div>
          </section> : null}

          {activeSection === 'dashboard' ? <section className="manager-bottom-grid">
            <article className="manager-panel table-card" id="manager-orders">
              <div className="manager-panel-head"><h2>Orders</h2><button type="button">Today</button></div>
              <table><thead><tr><th>Order</th><th>Location</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>
                {orders.map(([id, location, count, total, status]) => <tr key={id}><td>{id}</td><td>{location}</td><td>{count}</td><td>{total}</td><td><span className={`table-status ${status.toLowerCase().replaceAll(' ', '')}`}>{status}</span></td></tr>)}
              </tbody></table>
            </article>
            <article className="manager-panel kds-panel" id="manager-kitchen-display">
              <div className="manager-panel-head"><h2>Kitchen Display (KDS)</h2><button type="button">Ready</button></div>
              <div className="kds-grid">
                {kitchenTickets.map((ticket) => (
                  <article key={ticket.id}>
                    <strong>{ticket.id}</strong><small>{ticket.table} / {ticket.eta}</small>
                    {ticket.items.map((item) => <span key={item}>{item}</span>)}
                    <em>{ticket.status}</em>
                  </article>
                ))}
              </div>
            </article>
            <article className="manager-panel table-card" id="manager-room-service">
              <div className="manager-panel-head"><h2>Room Service</h2></div>
              <table><thead><tr><th>Request</th><th>Room</th><th>Items</th><th>Time</th><th>Status</th></tr></thead><tbody>
                {roomService.map(([id, room, count, time, status]) => <tr key={id}><td>{id}</td><td>{room}</td><td>{count}</td><td>{time}</td><td><span className={`table-status ${status.toLowerCase().replaceAll(' ', '')}`}>{status}</span></td></tr>)}
              </tbody></table>
            </article>
          </section> : null}

          {activeSection === 'dashboard' ? <section className="manager-bottom-grid">
            <article className="manager-panel table-card" id="manager-housekeeping">
              <div className="manager-panel-head"><h2>Housekeeping</h2></div>
              <table><tbody>{operatingPlan.map((item) => <tr key={item.area}><td>{item.area}</td><td>{item.owner}</td><td><span className="table-status checkedin">{item.status}</span></td></tr>)}</tbody></table>
            </article>
            <article className="manager-panel table-card" id="manager-billing-&-invoices">
              <div className="manager-panel-head"><h2>Billing & Invoices</h2><button type="button">+ New Invoice</button></div>
              <table><tbody>{reservations.map((reservation) => <tr key={reservation.id}><td>INV{reservation.id.slice(2)}</td><td>{reservation.guest}</td><td>{reservation.amount}</td><td><span className="table-status confirmed">Paid</span></td></tr>)}</tbody></table>
            </article>
            <article className="manager-panel analytics-panel">
              <div className="manager-panel-head"><h2>Reports & Analytics</h2></div>
              <div className="analytics-kpis"><span>Occupancy Rate <b>72%</b></span><span>Total Revenue <b>$42,570</b></span><span>ADR <b>$120.50</b></span><span>RevPAR <b>$86.76</b></span></div>
              <div className="bar-chart">{[58, 35, 48, 41, 70, 82].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div>
            </article>
          </section> : null}
        </main>
      </div>

      <div className="manager-admin-sections">
        <div className="page-header">
          <div>
            <p className="eyebrow">Manager controls</p>
            <h1>{tenant.name} admin settings</h1>
            <p>
              Configure scoped team access and the guest QR experience that powers the dashboard above.
            </p>
          </div>
        </div>
        <AssignStaffPanel tenant={tenant} />
        <GuestExperienceSettings tenant={tenant} />
      </div>
    </div>
  )
}
