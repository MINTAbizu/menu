import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="page-shell not-found-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Page not found</p>
          <h1>404 - route unavailable</h1>
          <p>The page you requested does not exist. Use the sidebar to navigate to one of the dashboards.</p>
          <Link to="/" className="primary-button">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}
