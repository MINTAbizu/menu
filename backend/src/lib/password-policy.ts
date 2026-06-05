const passwordRules = [
  { test: (value: string) => value.length >= 10, message: 'at least 10 characters' },
  { test: (value: string) => /[a-z]/.test(value), message: 'one lowercase letter' },
  { test: (value: string) => /[A-Z]/.test(value), message: 'one uppercase letter' },
  { test: (value: string) => /\d/.test(value), message: 'one number' },
  { test: (value: string) => /[^A-Za-z0-9]/.test(value), message: 'one special character' },
  { test: (value: string) => !/\s/.test(value), message: 'no spaces' },
]

export const passwordPolicyMessage =
  'Password must be at least 10 characters and include uppercase, lowercase, number, special character, and no spaces.'

export const validateStrongPassword = (value: string) => passwordRules.every((rule) => rule.test(value))
