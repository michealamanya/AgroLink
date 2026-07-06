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

/* ─── impact stats ───────────────────────────────────────────────────────── */
const IMPACT_STATS = [
  { value: 8,   suffix: '',   label: 'Sub-counties connected',      icon: '📍', desc: 'Covering all major sub-counties in Bushenyi District' },
  { value: 4,   suffix: '',   label: 'Stakeholder groups',          icon: '🤝', desc: 'Farmers, officers, dealers, and district offices' },
  { value: 24,  suffix: '/7', label: 'Platform availability',       icon: '🕐', desc: 'Always-on access from any device, any location' },
  { value: 100, suffix: '%',  label: 'Free for farmers',            icon: '🌾', desc: 'No cost at the point of use for all registered farmers' },
]

/* ─── animated counter ───────────────────────────────────────────────────── */
function AnimatedCounter({ target, suffix, duration = 1600 }) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let frame
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
      else setCount(target)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [started, target, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

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

      {/* ── IMPACT STATS ─────────────────────────────────────────── */}
      <section className="lp-impact-section" id="impact">
        <div className="lp-impact-inner">
          <Reveal>
            <span className="lp-section-tag lp-section-tag-light">District impact</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="lp-section-h2 lp-section-h2-light" style={{ marginTop: '14px' }}>
              The numbers<br />
              <span style={{ color: '#4ade80' }}>behind the platform.</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="lp-section-lead lp-section-lead-light">
              AgroLink was built to solve a real, documented problem — farmers with no access
              to genuine advice, fake inputs destroying harvests, and zero coordination between
              the people who could help.
            </p>
          </Reveal>

          <div className="lp-impact-grid">
            {IMPACT_STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={200 + i * 100}>
                <div className="lp-impact-card">
                  <span className="lp-impact-icon">{stat.icon}</span>
                  <strong className="lp-impact-value">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </strong>
                  <span className="lp-impact-label">{stat.label}</span>
                  <span className="lp-impact-desc">{stat.desc}</span>
                </div>
              </Reveal>
            ))}
          </div>
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

      {/* ── CONTACT ─────────────────────────────────────────────── */}
      <section className="lp-section lp-section-white" id="contact">
        <Reveal><span className="lp-section-tag">Contact</span></Reveal>
        <Reveal delay={80}>
          <h2 className="lp-section-h2">
            Get in touch with<br />
            <span className="lp-green">the development team.</span>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="lp-section-lead">
            Have a question, feedback, or want to collaborate on the AgroLink platform?
            Reach us through any of the channels below.
          </p>
        </Reveal>

        <div className="lp-contact-grid">

          {/* Email */}
          <Reveal delay={100}>
            <a href="mailto:amanyamicheal8@gmail.com" className="lp-contact-card">
              <div className="lp-contact-icon lp-contact-icon-email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="lp-contact-info">
                <strong>Email</strong>
                <span>amanyamicheal8@gmail.com</span>
              </div>
              <span className="lp-contact-arrow">→</span>
            </a>
          </Reveal>

          {/* WhatsApp */}
          <Reveal delay={160}>
            <a href="https://wa.me/256742653997" target="_blank" rel="noreferrer" className="lp-contact-card">
              <div className="lp-contact-icon lp-contact-icon-whatsapp">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.555 4.116 1.523 5.845L.057 23.998l6.305-1.44A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.94a9.925 9.925 0 0 1-5.06-1.384l-.363-.215-3.743.854.87-3.649-.236-.374A9.943 9.943 0 0 1 2.06 12C2.06 6.507 6.507 2.06 12 2.06S21.94 6.507 21.94 12 17.493 21.94 12 21.94z"/>
                </svg>
              </div>
              <div className="lp-contact-info">
                <strong>WhatsApp</strong>
                <span>+256 742 653 997</span>
              </div>
              <span className="lp-contact-arrow">→</span>
            </a>
          </Reveal>

          {/* X / Twitter */}
          <Reveal delay={220}>
            <a href="https://x.com/amanya_micheal" target="_blank" rel="noreferrer" className="lp-contact-card">
              <div className="lp-contact-icon lp-contact-icon-x">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <div className="lp-contact-info">
                <strong>X (Twitter)</strong>
                <span>@amanya_micheal</span>
              </div>
              <span className="lp-contact-arrow">→</span>
            </a>
          </Reveal>

          {/* LinkedIn */}
          <Reveal delay={280}>
            <a href="https://linkedin.com/in/amanya-micheal" target="_blank" rel="noreferrer" className="lp-contact-card">
              <div className="lp-contact-icon lp-contact-icon-linkedin">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div className="lp-contact-info">
                <strong>LinkedIn</strong>
                <span>amanya-micheal</span>
              </div>
              <span className="lp-contact-arrow">→</span>
            </a>
          </Reveal>

          {/* GitHub */}
          <Reveal delay={340}>
            <a href="https://github.com/michealamanya" target="_blank" rel="noreferrer" className="lp-contact-card">
              <div className="lp-contact-icon lp-contact-icon-github">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </div>
              <div className="lp-contact-info">
                <strong>GitHub</strong>
                <span>github.com/michealamanya</span>
              </div>
              <span className="lp-contact-arrow">→</span>
            </a>
          </Reveal>

          {/* Phone */}
          <Reveal delay={400}>
            <a href="tel:+256742653997" className="lp-contact-card">
              <div className="lp-contact-icon lp-contact-icon-phone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.07 6.07l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div className="lp-contact-info">
                <strong>Phone</strong>
                <span>+256 742 653 997</span>
              </div>
              <span className="lp-contact-arrow">→</span>
            </a>
          </Reveal>

        </div>

        {/* Developer team note */}
        <Reveal delay={460}>
          <div className="lp-dev-note">
            <div className="lp-dev-avatar">NG</div>
            <div>
              <strong>Godfrey Nkesiga</strong>
              <p>Lead Developer · AgroLink Platform · Bushenyi District, Uganda</p>
            </div>
            <p>This platform is developed and maintained by the AgroLink development team in Bushenyi District, Uganda.</p>
          </div>
        </Reveal>
      </section>

      {/* ── CTA STRIP ───────────────────────────────────────────────── */}
      <section className="lp-cta-strip">
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
