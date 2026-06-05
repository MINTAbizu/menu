import { getPasswordRules, getPasswordStrength } from '../passwordPolicy'

export function PasswordStrength({ password }: { password: string }) {
  const strength = getPasswordStrength(password)
  const rules = getPasswordRules(password)

  return (
    <div className={`password-strength password-strength-${strength.tone}`} aria-live="polite">
      <div className="password-strength-head">
        <span>Password strength</span>
        <strong>{strength.label}</strong>
      </div>
      <div className="password-strength-meter" aria-hidden="true">
        <span style={{ width: `${(strength.score / 4) * 100}%` }} />
      </div>
      <div className="password-rules">
        {rules.map((rule) => (
          <span key={rule.id} className={rule.passed ? 'is-met' : ''}>
            {rule.passed ? '+' : '-'} {rule.label}
          </span>
        ))}
      </div>
    </div>
  )
}
