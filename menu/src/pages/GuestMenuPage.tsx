import { useEffect, useMemo, useState } from 'react'
import { getPublicMenu } from '../api'
import type { MenuCategory, Tenant } from '../types'

export function GuestMenuPage({ tenant }: { tenant: Tenant }) {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getPublicMenu(tenant.slug)
      .then((data) => {
        if (!cancelled) setCategories(data.categories)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Unable to load guest menu')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [tenant])

  const filtered = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
        ),
      })),
    [categories, query],
  )

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Guest QR menu</p>
          <h1>{tenant.name} luxury menu experience</h1>
          <p>
            A premium mobile-first QR menu built for guests, with instant menu loading,
            search, category browsing, and ordering-ready UI.
          </p>
        </div>
      </div>

      <section className="section-card">
        <div className="search-panel">
          <input
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search menu items or categories"
          />
          <div className="search-meta">
            <span>{categories.length} categories</span>
            <span>{query ? 'filtered view' : 'live guest menu'}</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading guest menu…</div>
        ) : error ? (
          <div className="alert">{error}</div>
        ) : (
          filtered.map((category) => (
            <div key={category._id} className="menu-category-card">
              <div className="section-heading">
                <span className="eyebrow">{category.name}</span>
                <h2>{category.items.length} options</h2>
              </div>
              <div className="menu-card-grid">
                {category.items.map((item) => (
                  <article key={item._id} className="menu-card">
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.category}</span>
                    </div>
                    <div>
                      <small>{item.tags.join(' · ')}</small>
                      <strong>${item.price}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
