function AuthForm({
  authBusy,
  authForm,
  authMode,
  handleAuthSubmit,
  setAuthForm,
}) {
  return (
    <form className="smart-form auth-form" onSubmit={handleAuthSubmit}>
      {authMode === 'register' ? (
        <div className="auth-form-grid">
          <label>
            Full name
            <input
              required
              placeholder="Enter full name"
              value={authForm.name}
              onChange={(event) =>
                setAuthForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Role
            <select
              value={authForm.role}
              onChange={(event) =>
                setAuthForm((current) => ({
                  ...current,
                  role: event.target.value,
                }))
              }
            >
              <option value="farmer">Farmer</option>
              <option value="extension">Extension Officer</option>
              <option value="dealer">Agro-Input Dealer</option>
              <option value="district">District Agriculture Office</option>
            </select>
          </label>
          <label>
            District
            <input
              required
              placeholder="Bushenyi District"
              value={authForm.district}
              onChange={(event) =>
                setAuthForm((current) => ({
                  ...current,
                  district: event.target.value,
                }))
              }
            />
          </label>
        </div>
      ) : null}

      <label>
        Email
        <input
          required
          type="email"
          placeholder="name@example.com"
          value={authForm.email}
          onChange={(event) =>
            setAuthForm((current) => ({
              ...current,
              email: event.target.value,
            }))
          }
        />
      </label>

      <label>
        Password
        <input
          required
          type="password"
          placeholder={
            authMode === 'register'
              ? 'Create a strong password'
              : 'Enter your password'
          }
          value={authForm.password}
          onChange={(event) =>
            setAuthForm((current) => ({
              ...current,
              password: event.target.value,
            }))
          }
        />
      </label>

      <div className="auth-helper-copy">
        {authMode === 'register'
          ? 'Create an account with the stakeholder role that matches your approved operational responsibility.'
          : 'Use your assigned account details to continue into the full application workspace.'}
      </div>

      <button type="submit" className="primary-button auth-submit" disabled={authBusy}>
        {authBusy
          ? 'Please wait...'
          : authMode === 'register'
            ? 'Create account'
            : 'Sign in'}
      </button>
    </form>
  )
}

export default AuthForm
