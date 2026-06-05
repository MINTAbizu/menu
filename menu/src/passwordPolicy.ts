export type PasswordRule = {
  id: string
  label: string
  passed: boolean
}

export function getPasswordRules(password: string): PasswordRule[] {
  return [
    { id: 'length', label: '10+ characters', passed: password.length >= 10 },
    { id: 'lowercase', label: 'Lowercase letter', passed: /[a-z]/.test(password) },
    { id: 'uppercase', label: 'Uppercase letter', passed: /[A-Z]/.test(password) },
    { id: 'number', label: 'Number', passed: /\d/.test(password) },
    { id: 'special', label: 'Special character', passed: /[^A-Za-z0-9]/.test(password) },
    { id: 'spaces', label: 'No spaces', passed: !/\s/.test(password) },
  ]
}

export function isStrongPassword(password: string) {
  return getPasswordRules(password).every((rule) => rule.passed)
}

export function getPasswordStrength(password: string) {
  const passedCount = getPasswordRules(password).filter((rule) => rule.passed).length

  if (!password) return { label: 'Not started', score: 0, tone: 'empty' }
  if (passedCount <= 2) return { label: 'Weak', score: 1, tone: 'weak' }
  if (passedCount <= 4) return { label: 'Getting better', score: 2, tone: 'medium' }
  if (passedCount === 5) return { label: 'Almost strong', score: 3, tone: 'good' }
  return { label: 'Strong', score: 4, tone: 'strong' }
}
