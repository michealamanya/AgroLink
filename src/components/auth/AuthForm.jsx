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

function AuthForm({ authBusy, authForm, authMode, handleAuthSubmit, handleForgotPassword, setAuthForm }) {
  const [showPassword, setShowPassword]   = useState(false)
  const [error, setError]                 = useState(null)
  const [resetState, setResetState]       = useState(null) // null | 'sending' | 'sent' | { error }
  const isRegister = authMode === 'register'

  function field(key) {
    return (e) => {
      setError(null)
      setAuthForm(c => ({ ...c, [key]: e.target.value }))
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)
    try {
      await handleAuthSubmit(e, authMode)
    } catch (err) {
      setError(err?.message ?? 'Something went wrong. Please try again.')
    }
  }

  async function onForgotPassword() {
    if (!authForm.email?.trim()) {
      setError('Enter your email address above, then click Forgot password.')
      return
    }
    setResetState('sending')
    const result = await handleForgotPassword(authForm.email)
    if (result?.success) {
      setResetState('sent')
    } else {
      setResetState({ error: result?.error ?? 'Could not send reset email. Please try again.' })
    }
  }

  // reset-sent confirmation screen
  if (resetState === 'sent') {
    return (
      <div className="ap-reset-sent">
        <div className="ap-reset-sent-icon">✉️</div>
        <h3 className="ap-reset-sent-title">Check your inbox</h3>
        <p className="ap-reset-sent-body">
          A password reset link has been sent to <strong>{authForm.email}</strong>.
          Check your email and follow the link to set a new password.
        </p>
        <p className="ap-reset-sent-hint">
          Didn't receive it? Check your spam folder or wait a minute before trying again.
        </p>
        <button type="button" className="ap-btn-ghost ap-reset-back"
          onClick={() => setResetState(null)}>
          ← Back to sign in
        </button>
      </div>
    )
  }

  return (
    <form className="ap-form" onSubmit={onSubmit} noValidate>

      {isRegister ? (
        <>
          <div className="ap-field">
            <label className="ap-field-label">Full name</label>
            <input className="ap-input" required placeholder="e.g. Ninsiima Grace"
              value={authForm.name} onChange={field('name')} />
          </div>
          <div className="ap-field">
            <label className="ap-field-label">District</label>
            <input className="ap-input" required placeholder="Bushenyi District"
              value={authForm.district} onChange={field('district')} />
          </div>
        </>
      ) : null}

      <div className="ap-field">
        <label className="ap-field-label">Email address</label>
        <input
          className={`ap-input ${error ? 'ap-input-error' : ''}`}
          required type="email" placeholder="you@gmail.com"
          autoComplete="email"
          value={authForm.email} onChange={field('email')}
        />
      </div>

      <div className="ap-field">
        <div className="ap-field-row">
          <label className="ap-field-label">Password</label>
          {!isRegister ? (
            <button type="button" className="ap-forgot"
              disabled={resetState === 'sending'}
              onClick={onForgotPassword}>
              {resetState === 'sending' ? 'Sending…' : 'Forgot password?'}
            </button>
          ) : null}
        </div>
        <div className="ap-input-wrap">
          <input
            className={`ap-input ap-input-pw ${error ? 'ap-input-error' : ''}`}
            required
            type={showPassword ? 'text' : 'password'}
            placeholder={isRegister ? 'At least 6 characters' : 'Enter your password'}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={authForm.password} onChange={field('password')}
          />
          <button type="button" className="ap-eye" tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(v => !v)}>
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </div>

      {/* forgot password error (wrong state) */}
      {resetState?.error ? (
        <div className="ap-form-error" role="alert">
          <span className="ap-error-icon" aria-hidden="true">⚠️</span>
          {resetState.error}
        </div>
      ) : null}

      {/* sign-in error */}
      {error ? (
        <div className="ap-form-error" role="alert">
          <span className="ap-error-icon" aria-hidden="true">⚠️</span>
          {error}
        </div>
      ) : null}

      <button type="submit" className="ap-btn-primary ap-btn-submit" disabled={authBusy}>
        {authBusy ? (
          <span className="ap-spinner-row">
            <span className="ap-btn-spinner" />
            Please wait…
          </span>
        ) : isRegister ? 'Create account' : 'Sign in'}
      </button>
    </form>
  )
}

export default AuthForm
