/**
 * SiteLayout — shared wrapper for all public pages.
 * Provides the sticky navbar and footer.
 * Import this in every public page except the homepage
 * (OverviewPage handles its own overlay nav).
 */
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../landing.css'

const NAV_LINKS = [
  { label: 'About',        to: '/about' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Features',     to: '/features' },
  { label: 'Roles',        to: '/roles' },
  { label: 'Impact',       to: '/impact' },
  { label: 'FAQs',         to: '/faqs' },
  { label: 'Contact',      to: '/contact' },
]

function SiteNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header className={`lp-nav lp-nav-scrolled lp-nav-page ${scrolled ? 'lp-nav-shadow' : ''}`}>
      <div className="lp-nav-inner">
        <NavLink to="/" className="lp-logo">
          <span className="lp-logo-mark" style={{ background: '#15803d' }}>A</span>
          <span className="lp-logo-text">AgroLink</span>
        </NavLink>

        <button className="lp-hamburger lp-hamburger-dark" aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}>
          <span /><span /><span />
        </button>

        <nav className={`lp-nav-links lp-nav-links-page ${open ? 'lp-nav-links-open' : ''}`}>
          {NAV_LINKS.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) =>
              `lp-nav-link lp-nav-link-page ${isActive ? 'lp-nav-link-active' : ''}`
            } onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/access" className="lp-nav-signin lp-nav-signin-page"
            onClick={() => setOpen(false)}>Sign in</NavLink>
          <NavLink to="/access" className="lp-nav-cta" onClick={() => setOpen(false)}>
            Get started →
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div>
          <span className="lp-logo-text" style={{ fontSize: '1.1rem' }}>AgroLink</span>
          <p>Smart agricultural service delivery for Bushenyi District, Uganda.</p>
        </div>
        <div className="lp-footer-links">
          {NAV_LINKS.map(item => (
            <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
          ))}
        </div>
      </div>
      <div className="lp-footer-bottom">
        <span>© 2026 AgroLink · Uganda Smart Agriculture</span>
      </div>
    </footer>
  )
}

function SiteLayout({ children, title, subtitle }) {
  // scroll to top on page mount
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="lp-root lp-page-root">
      <SiteNav />

      {/* page hero strip */}
      {title ? (
        <div className="lp-page-hero">
          <div className="lp-page-hero-inner">
            <h1 className="lp-page-hero-title">{title}</h1>
            {subtitle ? <p className="lp-page-hero-sub">{subtitle}</p> : null}
          </div>
        </div>
      ) : null}

      <main className="lp-page-main">
        {children}
      </main>

      <SiteFooter />
    </div>
  )
}

export default SiteLayout
