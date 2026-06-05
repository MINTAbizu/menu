import { createUserSchema } from '../dist/controllers/user-controller.js'

function test(payload) {
  try {
    createUserSchema.parse(payload)
    console.log('VALID')
  } catch (err) {
    if (err && err.issues) {
      console.error('ZOD_ERROR')
      console.error(JSON.stringify(err.issues, null, 2))
      process.exit(1)
    }
    console.error('ERROR', String(err))
    process.exit(1)
  }
}

// Sample payload similar to what produced 422
const payload = {
  email: 'zola@example.com',
  password: '••••••••',
  fullName: 'e'
}

console.log('Testing payload:', JSON.stringify(payload))
test(payload)
