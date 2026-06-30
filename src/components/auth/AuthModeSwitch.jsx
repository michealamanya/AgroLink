function AuthModeSwitch({ authMode, setAuthMode }) {
  return (
    <div className="toggle-row auth-toggle-row">
      <button
        type="button"
        className={`toggle-button ${authMode === 'login' ? 'toggle-active' : ''}`}
        onClick={() => setAuthMode('login')}
      >
        Sign in
      </button>
      <button
        type="button"
        className={`toggle-button ${authMode === 'register' ? 'toggle-active' : ''}`}
        onClick={() => setAuthMode('register')}
      >
        Register
      </button>
    </div>
  )
}

export default AuthModeSwitch
