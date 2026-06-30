import { useEffect } from 'react'
import homeBackground from '../assets/background.jpg'
import AuthForm from './auth/AuthForm'
import AuthModeSwitch from './auth/AuthModeSwitch'
import AuthSessionPanel from './auth/AuthSessionPanel'

function AccessPage({ state }) {
  const {
    authBusy,
    authForm,
    authMode,
    currentProfile,
    currentUser,
    handleAuthSubmit,
    handleLogout,
    setAuthForm,
    setAuthMode,
  } = state

  useEffect(() => {
    setAuthMode('login')
  }, [setAuthMode])

  return (
    <section className="auth-page-shell">
      <article
        className="auth-spotlight-panel"
        style={{
          '--home-background-image': `url(${homeBackground})`,
        }}
      >
        <div className="auth-spotlight-copy">
          <span className="eyebrow">Secure Sign In</span>
          <h2>Access the agricultural workspace assigned to your role.</h2>
          <p>
            Farmers, extension officers, agro-input dealers, and district teams
            enter through protected authentication before reaching any dashboard
            or operational records.
          </p>
          <div className="auth-benefit-strip">
            <span>Protected records</span>
            <span>Role-based routing</span>
            <span>Operational actions</span>
          </div>
        </div>

        <div className="auth-credential-card">
          <div className="section-title">
            <span className="eyebrow">Authentication</span>
            <h3>{authMode === 'register' ? 'Create stakeholder account' : 'Sign in'}</h3>
          </div>

          <AuthModeSwitch authMode={authMode} setAuthMode={setAuthMode} />
          <AuthForm
            authBusy={authBusy}
            authForm={authForm}
            authMode={authMode}
            handleAuthSubmit={handleAuthSubmit}
            setAuthForm={setAuthForm}
          />
        </div>
      </article>

      <article className="content-card auth-support-card">
        <div className="section-title">
          <span className="eyebrow">Access Status</span>
          <h3>Account and role verification</h3>
        </div>
        <AuthSessionPanel
          authBusy={authBusy}
          currentProfile={currentProfile}
          currentUser={currentUser}
          handleLogout={handleLogout}
        />
      </article>
    </section>
  )
}

export default AccessPage
