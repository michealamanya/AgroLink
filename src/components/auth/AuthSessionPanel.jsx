function AuthSessionPanel({ authBusy, currentProfile, currentUser, handleLogout }) {
  if (currentUser) {
    return (
      <div className="auth-session-panel">
        <span className="eyebrow">Signed In</span>
        <strong>{currentProfile?.name ?? currentUser.email}</strong>
        <p>{currentUser.email}</p>
        <span>Role: {currentProfile?.role ?? 'Profile loading'}</span>
        <span>District: {currentProfile?.district ?? 'Not set'}</span>
        <button
          type="button"
          className="secondary-button auth-submit"
          onClick={handleLogout}
          disabled={authBusy}
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="auth-session-panel">
      <span className="eyebrow">Protected Access</span>
      <strong>Only approved users continue into dashboards</strong>
      <p>
        Sign in with your assigned account to enter the workspace linked to your
        stakeholder role.
      </p>
    </div>
  )
}

export default AuthSessionPanel
