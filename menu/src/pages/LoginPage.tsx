import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

const loginRoles = [
  {
    role: 'SUPER_ADMIN',
    label: 'Super Admin',
    detail: 'Platform, hotels, subscriptions, and owner assignment.',
    email: 'admin@example.com',
    password: 'Aa@12345',
  },
  {
    role: 'HOTEL_OWNER',
    label: 'Hotel Owner',
    detail: 'Branding, QR menus, revenue, and manager access.',
    email: 'owner@aster.local',
    password: 'DemoPass1!',
  },
  {
    role: 'HOTEL_MANAGER',
    label: 'Hotel Manager',
    detail: 'Daily operations, staff roles, guest QR settings, and reports.',
    email: 'manager@aster.local',
    password: 'DemoPass1!',
  },
  {
    role: 'WAITER',
    label: 'Waiter',
    detail: 'Table orders, service requests, and guest handoff.',
    email: 'waiter@aster.local',
    password: 'DemoPass1!',
  },
  {
    role: 'KITCHEN_STAFF',
    label: 'Kitchen Staff',
    detail: 'Kitchen tickets, prep status, and order flow.',
    email: 'kitchen@aster.local',
    password: 'DemoPass1!',
  },
  {
    role: 'RECEPTIONIST',
    label: 'Receptionist',
    detail: 'Rooms, service requests, guest support, and front desk flow.',
    email: 'reception@aster.local',
    password: 'DemoPass1!',
  },
  {
    role: 'GUEST',
    label: 'Guest',
    detail: 'Guest menu and QR ordering access.',
    email: 'guest@aster.local',
    password: 'DemoPass1!',
  },
] as const

const dashboardByRole = {
  SUPER_ADMIN: '/super-admin',
  HOTEL_OWNER: '/owner',
  HOTEL_MANAGER: '/manager',
  WAITER: '/waiter',
  KITCHEN_STAFF: '/kitchen',
  RECEPTIONIST: '/reception',
  GUEST: '/guest-menu',
} as const

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  const [selectedRole, setSelectedRole] = useState<(typeof loginRoles)[number]['role']>('HOTEL_MANAGER')

  const from = (location.state as { from?: string })?.from ?? '/'
  const selectedRoleMeta = loginRoles.find((item) => item.role === selectedRole) ?? loginRoles[0]
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const passwordIsReady = password.length >= 8
  const canSubmit = emailIsValid && passwordIsReady

  const fillDemoAccount = () => {
    setEmail(selectedRoleMeta.email)
    setPassword(selectedRoleMeta.password)
    setTouched({ email: true, password: true })
    setError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ email: true, password: true })
    setLoading(true)
    setError(null)

    if (!canSubmit) {
      setLoading(false)
      setError('Enter a valid email and a password with at least 8 characters.')
      return
    }

    try {
      const session = await login(email.trim(), password)
      const roleHome = dashboardByRole[session.user.role] ?? '/'
      navigate(from === '/' || from === '/login' ? roleHome : from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell auth-shell">
      <header className="public-nav" aria-label="Public navigation">
        <div>
          <Link className="public-brand" to="/">
          <span className='AG'><span className='A'>A</span><span className='G'>G</span>  </span>
          <strong className='os'>Hospitality OS</strong>
        </Link>
        </div>

        <div>
           <nav className="public-menu" aria-label="Public menu">
          <a  className='workspace' href="#workspaces">Workspaces</a>
          <a  className="accessmodels"  href="#access-model">Access model</a>
          {/* <Link to="/guest-menu">Guest menu</Link> */}
          <Link className="primary-button" to="/login">Login</Link>
        </nav>
        </div>

    
      </header>
      <div className="auth-layout">
        <section className="auth-story">
          <p className="eyebrow">Secure access</p>
          <h1>One login for every hospitality role.</h1>
          <p>
            JWT authentication protects each dashboard, tenant headers scope APIs to the active
            hotel, and permissions keep platform, hotel, service, kitchen, reception, and guest
            workflows separated.
          </p>
          <div className="login-role-grid" aria-label="Available login roles">
            {loginRoles.map((item) => (
              <button
                key={item.role}
                type="button"
                className={item.role === selectedRole ? 'is-selected' : ''}
                onClick={() => setSelectedRole(item.role)}
              >
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section-card auth-card">
          <div className="section-heading">
            <span className="eyebrow">Sign in</span>
            <h2>{selectedRoleMeta.label} workspace</h2>
            <p className="auth-role-summary">{selectedRoleMeta.detail}</p>
          </div>
          <div className="selected-role-access">
            <div>
              <strong>Seeded demo account</strong>
              <span>{selectedRoleMeta.email}</span>
            </div>
            <button type="button" onClick={fillDemoAccount}>Use demo</button>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className={touched.email && !emailIsValid ? 'field-has-error' : ''}>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setTouched((current) => ({ ...current, email: true }))
                  setError(null)
                }}
                onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                required
                placeholder="name@example.com"
                autoComplete="email"
              />
              {touched.email && !emailIsValid ? <small className="field-hint">Use a valid email address.</small> : null}
            </label>
            <label className={touched.password && !passwordIsReady ? 'field-has-error' : ''}>
              Password
              <div className="password-input-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setTouched((current) => ({ ...current, password: true }))
                    setError(null)
                  }}
                  onBlur={() => setTouched((current) => ({ ...current, password: true }))}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {touched.password && !passwordIsReady ? <small className="field-hint">Password must be at least 8 characters.</small> : null}
            </label>
            {error ? <div className="alert">{error}</div> : null}
            <button className="primary-button" type="submit" disabled={loading || !canSubmit}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="login-access-note">
            <strong>Accounts are invitation based.</strong>
            <span>
              Super admins assign hotel owners, owners assign hotel managers, and managers assign
              operational staff. Use the credentials created for your role.
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
