import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPublicMenu } from '../api'
import { QRCode } from '../components/QRCode'
import {
  loadGuestExperience,
  type ExperienceMenuCategory,
  type HotelGuestExperience,
} from '../hotelExperience'
import type { Tenant } from '../types'

const devPhoneOrigin = 'http://192.168.43.251:5174'

const locationDirectory = [
  {
    tokenPrefix: 'qr-table-12',
    label: 'Table service',
    value: 'Table 12, main restaurant',
    badge: 'Dine-in',
    payment: 'Pay at table or online',
  },
  {
    tokenPrefix: 'qr-room-406',
    label: 'Room service',
    value: 'Room 406, fourth floor',
    badge: 'Room delivery',
    payment: 'Room charge or card',
  },
  {
    tokenPrefix: 'qr-lounge-3',
    label: 'Lounge service',
    value: 'Lounge 3, sky bar',
    badge: 'Bar service',
    payment: 'Pay online or at bar',
  },
]

function getDefaultPhoneOrigin() {
  const configuredOrigin = import.meta.env.VITE_PUBLIC_APP_URL
  if (configuredOrigin) return configuredOrigin

  if (typeof window === 'undefined') return devPhoneOrigin

  const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  return isLocalHost ? devPhoneOrigin : window.location.origin
}

export function GuestMenuPage({ tenant }: { tenant: Tenant }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [experience, setExperience] = useState<HotelGuestExperience>(() => loadGuestExperience(tenant.slug))
  const [categories, setCategories] = useState<ExperienceMenuCategory[]>(experience.categories)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [cartCount, setCartCount] = useState(2)
  const [language, setLanguage] = useState(tenant.languages?.[0] ?? 'English')
  const [phoneOrigin, setPhoneOrigin] = useState(getDefaultPhoneOrigin)
  const [activeKind, setActiveKind] = useState<'All' | 'Food' | 'Drink' | 'Service'>('All')
  const tableToken = searchParams.get('table')
  const roomToken = searchParams.get('room')
  const scanToken = tableToken ?? roomToken
  const knownLocation = locationDirectory.find((item) => scanToken?.startsWith(item.tokenPrefix))
  const hasQrLocation = Boolean(tableToken || roomToken)
  const serviceLocation = knownLocation
    ? knownLocation
    : tableToken
      ? {
          label: 'Table service',
          value: `Linked to ${tableToken}`,
          badge: 'Dine-in',
          payment: 'Pay at table or online',
        }
    : roomToken
      ? {
          label: 'Room service',
          value: `Linked to ${roomToken}`,
          badge: 'Room delivery',
          payment: 'Room charge or card',
        }
      : {
          label: 'Open menu preview',
          value: 'Scan a table or room QR to attach this order to a service location.',
          badge: 'Preview',
          payment: 'Scan QR to unlock ordering',
        }

  useEffect(() => {
    let cancelled = false
    const savedExperience = loadGuestExperience(tenant.slug)
    setExperience(savedExperience)
    setCategories(savedExperience.categories)
    setLoading(true)
    setError(null)
    getPublicMenu(tenant.slug)
      .then((data) => {
        if (!cancelled && data.categories.length > 0) {
          setCategories(
            data.categories.map((category) => ({
              ...category,
              kind: 'Food',
              description: 'Live menu from hotel kitchen.',
              enabled: true,
              items: category.items.map((item) => ({ ...item, available: true })),
            })),
          )
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setCategories(savedExperience.categories)
          setError(
            `${err.message || 'Unable to load live guest menu'} Showing sample menu so you can test the QR flow.`,
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [tenant])

  useEffect(() => {
    setLanguage(tenant.languages?.[0] ?? 'English')
  }, [tenant])

  const filtered = useMemo(
    () =>
      categories
        .filter((category) => category.enabled)
        .filter((category) => activeKind === 'All' || category.kind === activeKind)
        .map((category) => ({
          ...category,
          items: category.items.filter((item) =>
            item.available !== false &&
            `${item.name} ${item.category ?? ''} ${item.tags.join(' ')} ${item.description ?? ''}`
            .toLowerCase()
            .includes(query.toLowerCase()),
          ),
        })),
    [activeKind, categories, query],
  )

  const tableScanUrl = `${phoneOrigin.replace(/\/$/, '')}/hotel/${tenant.slug}/menu?table=qr-table-12-${tenant.slug.split('-')[0] ?? 'hotel'}`
  const visibleServices = experience.services.filter((service) => service.enabled)

  return (
    <div className={`page-shell guest-experience ${theme}`}>
      <div className="guest-hero">
        <div>
          <p className="eyebrow">Guest QR menu</p>
          <h1>{tenant.name}</h1>
          <p>
            {experience.welcomeMessage}
          </p>
          <div className="scan-context">
            <strong>{serviceLocation.label}</strong>
            <span>{serviceLocation.value}</span>
            {!hasQrLocation ? (
              <div className="scan-demo-actions">
                <button
                  type="button"
                  onClick={() => setSearchParams({ table: 'qr-table-12-aster' })}
                >
                  Simulate Table 12 scan
                </button>
                <button
                  type="button"
                  onClick={() => setSearchParams({ room: 'qr-room-406-aster' })}
                >
                  Simulate Room 406 scan
                </button>
                <button
                  type="button"
                  onClick={() => setSearchParams({ table: 'qr-lounge-3-aster' })}
                >
                  Simulate Lounge 3 scan
                </button>
              </div>
            ) : null}
          </div>
          <div className="scan-status-grid">
            <div>
              <span>Location</span>
              <strong>{serviceLocation.value}</strong>
            </div>
            <div>
              <span>Service mode</span>
              <strong>{serviceLocation.badge}</strong>
            </div>
            <div>
              <span>Payment</span>
              <strong>{serviceLocation.payment}</strong>
            </div>
          </div>
          <div className="guest-controls" aria-label="Guest menu controls">
            <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? 'Light' : 'Dark'} mode
            </button>
            {(tenant.languages ?? ['English']).map((item) => (
              <button
                key={item}
                type="button"
                className={item === language ? 'is-active' : ''}
                onClick={() => setLanguage(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="ai-recommendation">
          <span>{experience.hotelMood}</span>
          <strong>{experience.welcomeTitle}</strong>
          <small>
            {hasQrLocation
              ? `Order will be routed to ${serviceLocation.value}.`
              : 'Scan a printed QR card to route the order to a table, lounge, or room.'}
          </small>
        </div>
      </div>

      {!hasQrLocation ? (
        <section className="section-card qr-scan-panel">
          <div>
            <p className="eyebrow">Scan from your phone</p>
            <h2>Table 12 QR code</h2>
            <span>
              Keep this page open on your computer, scan the code with your phone camera, and the
              phone should open the guest menu with Table 12 attached.
            </span>
            <label className="phone-url-input">
              Phone-accessible app URL
              <input
                value={phoneOrigin}
                onChange={(event) => setPhoneOrigin(event.target.value)}
                placeholder="http://your-computer-ip:5173"
              />
            </label>
            <code>{tableScanUrl}</code>
          </div>
          <div className="qr-print-card qr-phone-card">
            <QRCode data={tableScanUrl} label="Scan Table 12 guest menu QR code" />
            <strong>{tenant.name}</strong>
            <span>Table 12 menu</span>
          </div>
        </section>
      ) : null}

      <section className="section-card glass-panel">
        <div className="guest-services-panel">
          <div className="section-heading">
            <span className="eyebrow">Available from this QR</span>
            <h2>Hotel services, food, and drinks</h2>
          </div>
          <div className="guest-service-grid">
            {visibleServices.map((service) => (
              <article key={service.id} className="guest-service-card">
                <span>{service.icon}</span>
                <strong>{service.name}</strong>
                <small>{service.description}</small>
                {experience.showServiceEta ? <em>{service.eta}</em> : null}
              </article>
            ))}
          </div>
        </div>

        <div className="search-panel">
          <div className="search-row">
            <input
              className="search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search menu items or categories"
            />
            <button type="button">Voice</button>
          </div>
          <div className="search-meta">
            <span>{categories.length} categories</span>
            <span>{query ? 'Filtered view' : 'Live guest menu'}</span>
            <span>{language}</span>
          </div>
          <div className="menu-kind-tabs">
            {(['All', 'Food', 'Drink', 'Service'] as const).map((kind) => (
              <button
                key={kind}
                type="button"
                className={activeKind === kind ? 'is-active' : ''}
                onClick={() => setActiveKind(kind)}
              >
                {kind}
              </button>
            ))}
          </div>
          <div className="filter-row">
            {['Chef picks', 'Vegan', 'Gluten free', 'Room service', 'Under 20 min'].map((filter) => (
              <button key={filter} type="button">{filter}</button>
            ))}
          </div>
        </div>

        {error ? <div className="status-message fallback-note">{error}</div> : null}

        {loading ? (
          <div className="loading-state">Loading guest menu...</div>
        ) : (
          filtered.map((category) => (
            <div key={category._id} className="menu-category-card">
              <div className="section-heading">
                <span className="eyebrow">{category.kind}</span>
                <h2>{category.name}</h2>
                <p>{category.description}</p>
              </div>
              <div className="menu-card-grid">
                {category.items.map((item) => (
                  <article key={item._id} className="menu-card">
                    <div className="menu-art" style={{ background: item.accent }} />
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.description ?? item.category}</span>
                    </div>
                    <div>
                      <small>{item.tags.join(' / ')}</small>
                      <strong>
                        {item.price === 0 ? 'Included' : `${experience.defaultCurrency}${item.price}`}
                      </strong>
                    </div>
                    <div className="menu-detail-row">
                      {item.prepMinutes ? <span>{item.prepMinutes} min</span> : null}
                      {item.serviceWindow ? <span>{item.serviceWindow}</span> : null}
                    </div>
                    {experience.showNutrition && item.nutrition ? (
                      <div className="nutrition-panel">
                        <span>{item.nutrition.calories} cal</span>
                        <span>{item.nutrition.protein} protein</span>
                        <span>{item.nutrition.carbs} carbs</span>
                        {item.nutrition.diet.map((diet) => <span key={diet}>{diet}</span>)}
                        {item.nutrition.allergens.length > 0 ? (
                          <small>Allergens: {item.nutrition.allergens.join(', ')}</small>
                        ) : (
                          <small>No listed allergens</small>
                        )}
                      </div>
                    ) : null}
                    <button type="button" onClick={() => setCartCount((value) => value + 1)}>
                      {category.kind === 'Service' ? 'Request service' : 'Add to cart'}
                    </button>
                  </article>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <aside className="floating-cart" aria-label="Cart and order tracking">
        <div>
          <strong>{cartCount} items</strong>
          <span>
            {hasQrLocation
              ? `${serviceLocation.label}: ready to send to kitchen`
              : 'Preview mode: scan QR to enable table or room ordering'}
          </span>
        </div>
        <button type="button" disabled={!hasQrLocation}>
          {hasQrLocation ? 'Pay now' : 'Scan QR first'}
        </button>
      </aside>
    </div>
  )
}
