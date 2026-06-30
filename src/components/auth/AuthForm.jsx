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
        <>
          <label>
            Full name
            <input
              required
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
              value={authForm.district}
              onChange={(event) =>
                setAuthForm((current) => ({
                  ...current,
                  district: event.target.value,
                }))
              }
            />
          </label>
        </>
      ) : null}

      <label>
        Email
        <input
          required
          type="email"
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
          value={authForm.password}
          onChange={(event) =>
            setAuthForm((current) => ({
              ...current,
              password: event.target.value,
            }))
          }
        />
      </label>

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
