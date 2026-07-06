import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../landing.css'
import homeBackground from '../assets/background.jpg'
import { faqItems, publicNavLinks, quickStats } from '../data/appData'

/* ─── scroll-reveal hook ───────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`lp-reveal ${visible ? 'lp-reveal-in' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  )
}

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

        <button className="lp-hamburger" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>
          <span /><span /><span />
        </button>

        <nav className={`lp-nav-links ${open ? 'lp-nav-links-open' : ''}`}>
          {publicNavLinks.map(item => (
            <a key={item.href} href={item.href} className="lp-nav-link" onClick={() => setOpen(false)}>{item.label}</a>
          ))}
          <NavLink to="/access" className="lp-nav-signin" onClick={() => setOpen(false)}>Sign in</NavLink>
          <NavLink to="/access" className="lp-nav-cta" onClick={() => setOpen(false)}>Get started →</NavLink>
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
        <div key={s.label} className="lp-stat-item" style={{ animationDelay: `${0.8 + i * 0.15}s` }}>
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

/* ─── how it works steps ───────────────────────────────────────────────── */
const HOW_STEPS = [
  {
    n: '01',
    icon: '🌱',
    title: 'Register your farm profile',
    body: 'Farmers and extension officers create a profile with parish, production focus, and contact channel. Takes under 2 minutes.',
    detail: 'Name · Parish · Crop focus · Contact channel',
  },
  {
    n: '02',
    icon: '⚠️',
    title: 'Report field issues instantly',
    body: 'Log a pest, disease, or weather damage the moment you see it. Extension officers are notified and assigned automatically.',
    detail: 'Pest/disease · Location · Severity level',
  },
  {
    n: '03',
    icon: '📢',
    title: 'Receive targeted advisories',
    body: 'Extension teams publish guidance matched to your crop focus. You get relevant advice — not generic broadcasts.',
    detail: 'SMS · Mobile web · Field bulletin',
  },
  {
    n: '04',
    icon: '📦',
    title: 'Find verified agro-inputs',
    body: 'Check which dealers have verified seed, spray, or fertiliser in stock near you before you make the trip.',
    detail: 'Verified stock · Dealer name · Quantity',
  },
]

/* ─── features ─────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: '🌾', title: 'Farmer Services',     text: 'Register farmers, track production focus, and deliver localized advice that reaches communities faster.' },
  { icon: '🔬', title: 'Extension Response',  text: 'Capture pest and disease incidents early, assign officers, and monitor field response from one place.' },
  { icon: '📦', title: 'Input Management',    text: 'Show trusted agro-input stock, dealer visibility, and supply status for easier farmer decision-making.' },
  { icon: '🏛️', title: 'District Oversight',  text: 'Give local government teams a clearer picture of activity, response pressure, and advisory reach.' },
]

/* ─── roles ─────────────────────────────────────────────────────────────── */
const ROLES = [
  { icon: '👨‍🌾', label: 'Farmer',           color: '#f0fdf4', accent: '#166534', text: 'Access advice, report field issues, check verified inputs, and plan your season.' },
  { icon: '🧑‍💼', label: 'Extension Officer', color: '#eff6ff', accent: '#1e40af', text: 'Publish guidance, assign officers, and manage incident response across your area.' },
  { icon: '🏪', label: 'Agro-Input Dealer',  color: '#fff7ed', accent: '#9a3412', text: 'List verified stock, monitor demand signals, and support transparent supply.' },
  { icon: '🏛️', label: 'District Office',    color: '#faf5ff', accent: '#6b21a8', text: 'Oversee all district activity, track advisories, and coordinate service delivery.' },
]

/* ─── main component ───────────────────────────────────────────────────── */
function OverviewPage() {
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="lp-root" style={{ '--hero-bg': `url(${homeBackground})` }}>
      <Nav scrolled={scrolled} />

      {/* ── HERO ────────────────────────────────────────────────────── */}
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
            <a href="#how" className="lp-cta-ghost">See how it works</a>
          </div>
          <StatBar />
        </div>
      </section>

      {/* ── PLATFORM INTRO ──────────────────────────────────────────── */}
      <section className="lp-section lp-section-white" id="about">
        <Reveal className="lp-section-tag-wrap">
          <span className="lp-section-tag">Platform</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="lp-section-h2">
            One system.<br />
            <span className="lp-green">Four stakeholder groups.</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="lp-section-lead">
            AgroLink brings farmers, extension officers, agro-input dealers, and district
            agriculture offices into a single coordinated platform — so information moves
            faster than problems do.
          </p>
        </Reveal>
        <div className="lp-pillars">
          {['Field-first coordination', 'Trusted service delivery', 'District visibility'].map((t, i) => (
            <Reveal key={t} delay={200 + i * 100}>
              <div className="lp-pillar-tag">{t}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="lp-section lp-section-soft" id="how">
        <div className="lp-how-header">
          <Reveal>
            <span className="lp-section-tag">How it works</span>
            <h2 className="lp-section-h2 lp-how-h2">
              Simple as<br />
              <span className="lp-green">sending a message.</span>
            </h2>
            <p className="lp-section-lead">
              AgroLink is built for the realities of agriculture in Uganda.
              No complex training — just a clear workflow from field to district.
            </p>
          </Reveal>
        </div>
        <div className="lp-steps">
          {HOW_STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 120} className="lp-step-wrap">
              <div className="lp-step">
                <div className="lp-step-left">
                  <div className="lp-step-icon">{step.icon}</div>
                  <div className="lp-step-line" />
                </div>
                <div className="lp-step-body">
                  <span className="lp-step-num">{step.n}</span>
                  <h3 className="lp-step-title">{step.title}</h3>
                  <p className="lp-step-text">{step.body}</p>
                  <div className="lp-step-detail">{step.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────── */}
      <section className="lp-section lp-section-white" id="features">
        <Reveal><span className="lp-section-tag">Features</span></Reveal>
        <Reveal delay={80}>
          <h2 className="lp-section-h2">
            What the platform<br />
            <span className="lp-green">enables.</span>
          </h2>
        </Reveal>
        <div className="lp-features-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="lp-feature-card">
                <div className="lp-feature-icon">{f.icon}</div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-text">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ROLES ───────────────────────────────────────────────────── */}
      <section className="lp-section lp-section-dark" id="roles">
        <Reveal><span className="lp-section-tag lp-section-tag-light">Who it's for</span></Reveal>
        <Reveal delay={80}>
          <h2 className="lp-section-h2 lp-section-h2-light">
            Protected workspaces<br />for every role.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="lp-section-lead lp-section-lead-light">
            Each stakeholder signs in and lands on the dashboard built for their specific responsibilities.
            No one sees more than they need.
          </p>
        </Reveal>
        <div className="lp-roles-grid">
          {ROLES.map((r, i) => (
            <Reveal key={r.label} delay={i * 100}>
              <div className="lp-role-card" style={{ '--role-color': r.color, '--role-accent': r.accent }}>
                <div className="lp-role-icon">{r.icon}</div>
                <h3 className="lp-role-label">{r.label}</h3>
                <p className="lp-role-text">{r.text}</p>
                <NavLink to="/access" className="lp-role-link">Access workspace →</NavLink>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="lp-section lp-section-white" id="faqs">
        <Reveal><span className="lp-section-tag">FAQs</span></Reveal>
        <Reveal delay={80}><h2 className="lp-section-h2">Common questions.</h2></Reveal>
        <div className="lp-faq-list">
          {faqItems.map((item, i) => (
            <Reveal key={item.question} delay={i * 60}>
              <div className={`lp-faq-item ${openFaq === i ? 'lp-faq-open' : ''}`}>
                <button
                  className="lp-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.question}</span>
                  <span className="lp-faq-chevron">{openFaq === i ? '−' : '+'}</span>
                </button>
                <div className="lp-faq-a">
                  <p>{item.answer}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA STRIP ───────────────────────────────────────────────── */}
      <section className="lp-cta-strip" id="contact">
        <Reveal>
          <div className="lp-cta-strip-inner">
            <div>
              <h2 className="lp-cta-strip-h2">Ready to start?</h2>
              <p className="lp-cta-strip-sub">
                Sign in or register with the role that matches your agricultural responsibility.
              </p>
            </div>
            <NavLink to="/access" className="lp-cta-primary lp-cta-strip-btn">Get started →</NavLink>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <span className="lp-logo-text" style={{ fontSize: '1.1rem' }}>AgroLink</span>
            <p>Smart agricultural service delivery for Bushenyi District, Uganda.</p>
          </div>
          <div className="lp-footer-links">
            {publicNavLinks.map(item => (
              <a key={item.href} href={item.href}>{item.label}</a>
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
