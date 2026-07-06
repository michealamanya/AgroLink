import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../landing.css'
import homeBackground from '../assets/background.png'
import { publicNavLinks, quickStats } from '../data/appData'

/* ─── nav ──────────────────────────────────────────────────────────────── */
function Nav({ scrolled }) {
  const [open, setOpen] = useState(false)
  return (
    <header className={`lp-nav ${scrolled ? 'lp-nav-scrolled' : ''}`}>
      <div className="lp-nav-inner">
        <NavLink to="/" className="lp-logo">
          <span className="lp-logo-mark">A</span>
          <span className="lp-logo-text">AgroLink</span>
        </NavLink>

        <button className="lp-hamburger" aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}>
          <span /><span /><span />
        </button>

        <nav className={`lp-nav-links ${open ? 'lp-nav-links-open' : ''}`}>
          {publicNavLinks.map(item => (
            <NavLink key={item.href} to={item.href} className="lp-nav-link"
              onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/access" className="lp-nav-signin"
            onClick={() => setOpen(false)}>Sign in</NavLink>
          <NavLink to="/access" className="lp-nav-cta"
            onClick={() => setOpen(false)}>Get started →</NavLink>
        </nav>
      </div>
    </header>
  )
}

/* ─── hero stats bar ───────────────────────────────────────────────────── */
function StatBar() {
  return (
    <div className="lp-stat-bar">
      {quickStats.map((s, i) => (
        <div key={s.label} className="lp-stat-item"
          style={{ animationDelay: `${0.8 + i * 0.15}s` }}>
          <strong>{s.value}</strong>
          <span>{s.label}</span>
        </div>
      ))}
      <div className="lp-stat-item" style={{ animationDelay: '1.25s' }}>
        <strong style={{ color: 'var(--orange-solid)' }}>Free</strong>
        <span>For Farmers</span>
      </div>
    </div>
  )
}

/* ─── homepage — hero only ─────────────────────────────────────────────── */
function OverviewPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="lp-root" style={{ '--hero-bg': `url(${homeBackground})` }}>
      <Nav scrolled={scrolled} />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-bg" />
        <div className="lp-hero-overlay" />
        <div className="lp-hero-content">
          <div className="lp-hero-tag lp-hero-tag-anim">Uganda Smart Agriculture</div>
          <h1 className="lp-hero-h1 lp-hero-h1-anim">
            The Agricultural<br />
            <span className="lp-hero-accent">Information Platform</span><br />
            for Bushenyi District.
          </h1>
          <p className="lp-hero-sub lp-hero-sub-anim">
            Connecting farmers, extension officers, agro-input dealers, and district
            offices into one coordinated system for field reporting, advisory delivery,
            and verified supply visibility.
          </p>
          <div className="lp-hero-ctas lp-hero-ctas-anim">
            <NavLink to="/access" className="lp-cta-primary">Get started →</NavLink>
            <NavLink to="/about" className="lp-cta-ghost">Learn more</NavLink>
          </div>
          <StatBar />
        </div>
      </section>

      {/* ── quick nav cards below hero ───────────────────────────── */}
      <section className="lp-home-nav-section">
        <div className="lp-home-nav-grid">
          {publicNavLinks.map((item, i) => (
            <NavLink key={item.href} to={item.href} className="lp-home-nav-card"
              style={{ animationDelay: `${i * 60}ms` }}>
              <span className="lp-home-nav-label">{item.label}</span>
              <span className="lp-home-nav-arrow">→</span>
            </NavLink>
          ))}
          <NavLink to="/access" className="lp-home-nav-card lp-home-nav-card-cta">
            <span className="lp-home-nav-label">Sign in / Register</span>
            <span className="lp-home-nav-arrow">→</span>
          </NavLink>
        </div>
      </section>

      {/* footer */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <span className="lp-logo-text" style={{ fontSize: '1.1rem' }}>AgroLink</span>
            <p>Smart agricultural service delivery for Bushenyi District, Uganda.</p>
          </div>
          <div className="lp-footer-links">
            {publicNavLinks.map(item => (
              <NavLink key={item.href} to={item.href}>{item.label}</NavLink>
            ))}
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span>© 2026 AgroLink · Uganda Smart Agriculture</span>
        </div>
      </footer>
    </div>
  )
}

export default OverviewPage
