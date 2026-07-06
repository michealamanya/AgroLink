import { useState } from 'react'

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function AuthForm({ authBusy, authForm, authMode, handleAuthSubmit, setAuthForm }) {
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState(null)
  const isRegister = authMode === 'register'

  async function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    setLocalError(null)
    try {
      // pass authMode explicitly — never rely on stale App state
      await handleAuthSubmit(e, authMode)
    } catch (err) {
      setLocalError(err?.message ?? 'Something went wrong. Please try again.')
    }
  }

  return (
    <form className="ap-form" onSubmit={onSubmit} noValidate={false}>

      {isRegister ? (
        <>
          <div className="ap-field">
            <label className="ap-field-label">Full name</label>
            <input
              className="ap-input"
              required
              placeholder="e.g. Ninsiima Grace"
              value={authForm.name}
              onChange={e => setAuthForm(c => ({ ...c, name: e.target.value }))}
            />
          </div>
          <div className="ap-field">
            <label className="ap-field-label">District</label>
            <input
              className="ap-input"
              required
              placeholder="Bushenyi District"
              value={authForm.district}
              onChange={e => setAuthForm(c => ({ ...c, district: e.target.value }))}
            />
          </div>
        </>
      ) : null}

      <div className="ap-field">
        <label className="ap-field-label">Email address</label>
        <input
          className="ap-input"
          required
          type="email"
          placeholder="you@gmail.com"
          autoComplete="email"
          value={authForm.email}
          onChange={e => setAuthForm(c => ({ ...c, email: e.target.value }))}
        />
      </div>

      <div className="ap-field">
        <div className="ap-field-row">
          <label className="ap-field-label">Password</label>
          {!isRegister ? (
            <button type="button" className="ap-forgot">Forgot password?</button>
          ) : null}
        </div>
        <div className="ap-input-wrap">
          <input
            className="ap-input ap-input-pw"
            required
            type={showPassword ? 'text' : 'password'}
            placeholder={isRegister ? 'Create a strong password (min 6 chars)' : 'Enter your password'}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={authForm.password}
            onChange={e => setAuthForm(c => ({ ...c, password: e.target.value }))}
          />
          <button
            type="button"
            className="ap-eye"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(v => !v)}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </div>

      {localError ? (
        <div className="ap-form-error" role="alert">
          {localError}
        </div>
      ) : null}

      <button
        type="submit"
        className="ap-btn-primary ap-btn-submit"
        disabled={authBusy}
      >
        {authBusy
          ? 'Please wait...'
          : isRegister ? 'Create account' : 'Sign in'}
      </button>
    </form>
  )
}

export default AuthForm
