import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../auth.css'
import bg from '../assets/background.png'
import bg2 from '../assets/download.webp'
import bg3 from '../assets/img.jpg'
import { hasFirebaseConfig } from '../firebase'
import AccountPage from './AccountPage'
import AuthForm from './auth/AuthForm'

/* ─── sliding farm images on the left panel ────────────────────────── */
const SLIDES = [
  { img: bg,  headline: 'Smarter farming starts here.',     sub: 'Real-time field reports, verified inputs, and district-wide coordination.' },
  { img: bg2, headline: 'From field to district.',          sub: 'Extension officers, dealers, and district teams — all connected.' },
  { img: bg3, headline: 'Your workspace, your role.',       sub: 'Each stakeholder gets a dashboard built for their specific responsibilities.' },
]

function ImageSlider() {
  const [current, setCurrent] = useState(0)
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 4800)
    return () => clearInterval(timer.current)
  }, [])

  return (
    <div className="ap-slider">
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`ap-slide ${i === current ? 'ap-slide-active' : ''}`}
          style={{ backgroundImage: `url(${slide.img})` }}
          aria-hidden={i !== current}
        >
          <div className="ap-slide-overlay" />
        </div>
      ))}

      {/* text overlay */}
      <div className="ap-slider-content">
        <NavLink to="/" className="ap-back-link">
          <span>←</span> Back to website
        </NavLink>
        <div className="ap-slide-text" key={current}>
          <h2 className="ap-slide-headline">{SLIDES[current].headline}</h2>
          <p className="ap-slide-sub">{SLIDES[current].sub}</p>
        </div>
        <div className="ap-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`ap-dot ${i === current ? 'ap-dot-active' : ''}`}
              aria-label={`Slide ${i + 1}`}
              onClick={() => { setCurrent(i); clearInterval(timer.current) }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Google icon ───────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"/>
    </svg>
  )
}

/* ─── main page ─────────────────────────────────────────────────────── */
function AccessPage({ state }) {
  const {
    authBusy, authForm,
    currentProfile, currentUser,
    handleAuthSubmit, handleGoogleSignIn, handleGoogleRegister, handleLogout,
    setAuthForm, setAuthMode,
  } = state

  const [mode, setMode] = useState('login') // 'login' | 'register'
  // Holds Google user info when sign-in fails due to no profile
  const [noProfileInfo, setNoProfileInfo] = useState(null)

  useEffect(() => {
    setAuthMode(mode)
  }, [mode, setAuthMode])

  async function onGoogleClick() {
    if (mode === 'register') {
      // Register mode — always create as farmer
      await handleGoogleRegister()
    } else {
      // Sign-in mode — check profile exists
      const result = await handleGoogleSignIn()
      if (result?.noProfile) {
        // No AgroLink account — switch to register and pre-fill from Google
        setNoProfileInfo(result.googleUser)
        setMode('register')
        if (result.googleUser?.name) {
          setAuthForm(c => ({ ...c, name: result.googleUser.name, email: result.googleUser.email }))
        }
      }
    }
  }

  /* signed-in → full account settings page */
  if (currentUser) {
    return <AccountPage state={state} />
  }

  return (
    <div className="ap-root">
      <ImageSlider />

      <div className="ap-panel">
        <div className="ap-panel-inner">

          {/* "no profile" notice — shown when Google sign-in finds no account */}
          {noProfileInfo ? (
            <div className="ap-notice">
              <span className="ap-notice-icon">ℹ️</span>
              <div>
                <strong>No AgroLink account found</strong>
                <p>
                  <strong>{noProfileInfo.email}</strong> is not registered.
                  We've switched to registration — complete the form below to create
                  your account as a <strong>farmer</strong>.
                </p>
                <button type="button" className="ap-link" onClick={() => {
                  setNoProfileInfo(null)
                  setMode('login')
                  setAuthForm(c => ({ ...c, name: '', email: '' }))
                }}>
                  Try a different account
                </button>
              </div>
            </div>
          ) : null}

          {/* header */}
          <div className="ap-header">
            <h1 className="ap-title">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="ap-subtitle">
              {mode === 'login' ? (
                <>Don't have an account? <button type="button" className="ap-link" onClick={() => { setMode('register'); setNoProfileInfo(null) }}>Sign up</button></>
              ) : (
                <>Already have an account? <button type="button" className="ap-link" onClick={() => { setMode('login'); setNoProfileInfo(null) }}>Sign in</button></>
              )}
            </p>
          </div>

          {/* Google button */}
          {hasFirebaseConfig ? (
            <>
              <button
                type="button"
                className="ap-btn-google"
                onClick={onGoogleClick}
                disabled={authBusy}
              >
                <GoogleIcon />
                <span>
                  {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                </span>
              </button>

              {/* Register mode Google hint */}
              {mode === 'register' ? (
                <p className="ap-google-hint">
                  Sign up with Google to create a farmer account instantly.
                </p>
              ) : null}

              <div className="ap-divider">
                <span>or continue with email</span>
              </div>
            </>
          ) : null}

          {/* role notice for register mode */}
          {mode === 'register' ? (
            <div className="ap-role-notice">
              <span className="ap-role-notice-icon">🌾</span>
              <div>
                <strong>All new accounts start as Farmer</strong>
                <p>Your account role can be upgraded by the system administrator after registration if you are an extension officer, dealer, or district official.</p>
              </div>
            </div>
          ) : null}

          {/* the form */}
          <AuthForm
            authBusy={authBusy}
            authForm={authForm}
            authMode={mode}
            handleAuthSubmit={handleAuthSubmit}
            setAuthForm={setAuthForm}
          />

        </div>
      </div>
    </div>
  )
}

export default AccessPage
