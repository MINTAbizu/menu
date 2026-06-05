const apiBase = 'http://localhost:4000'
const superAdminEmail = 'admin@example.com'
const superAdminPassword = 'Aa@12345'

async function run() {
  try {
    console.log('Logging in as super admin...')
    let res = await fetch(`${apiBase}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: superAdminEmail, password: superAdminPassword }),
    })

    const loginBody = await res.text()
    console.log('Login status', res.status)
    console.log('Login body', loginBody)

    if (!res.ok) {
      console.error('Login failed; cannot continue')
      process.exit(1)
    }

    const loginJson = JSON.parse(loginBody)
    const token = loginJson.tokens?.accessToken
    if (!token) {
      console.error('No access token in login response')
      process.exit(1)
    }

    console.log('Creating user...')
    const userPayload = {
      email: 'zola+test@example.com',
      password: 'Secur3Pass!',
      fullName: 'Zola Test',
      role: 'HOTEL_OWNER',
      hotelSlug: 'aster-grand-addis'
    }

    res = await fetch(`${apiBase}/api/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userPayload),
    })

    const createBody = await res.text()
    console.log('Create status', res.status)
    console.log('Create body', createBody)
  } catch (err) {
    console.error('Error', err)
    process.exit(1)
  }
}

run()
