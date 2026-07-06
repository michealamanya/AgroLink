import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { Reveal } from '../components/RevealUtils'

function AnimatedCounter({ target, suffix, duration = 1600 }) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); observer.disconnect() } },
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
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
      else setCount(target)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [started, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const IMPACT_STATS = [
  { value: 8,   suffix: '',   label: 'Sub-counties connected',      icon: '📍', desc: 'Covering all major sub-counties in Bushenyi District' },
  { value: 4,   suffix: '',   label: 'Stakeholder groups',          icon: '🤝', desc: 'Farmers, officers, dealers, and district offices — all on one platform' },
  { value: 24,  suffix: '/7', label: 'Platform availability',       icon: '🕐', desc: 'Always-on access from any device, any location, any time' },
  { value: 100, suffix: '%',  label: 'Free for farmers',            icon: '🌾', desc: 'No cost at the point of use for all registered farmers' },
]

const OBJECTIVES = [
  'Design a secure, role-based registration and authentication module.',
  'Develop a searchable agro-input marketplace for dealers and farmers.',
  'Enable farmer-to-dealer connection for verified input discovery.',
  'Build an advisory module for extension officers to reach farmers.',
  'Provide a district reporting dashboard with real-time agricultural data.',
  'Evaluate usability through structured testing with real users in Bushenyi.',
]

function ImpactPage() {
  return (
    <SiteLayout
      title="District Impact"
      subtitle="The numbers and objectives behind AgroLink."
    >
      {/* counters */}
      <section className="lp-impact-section">
        <div className="lp-impact-inner">
          <Reveal>
            <span className="lp-section-tag lp-section-tag-light">By the numbers</span>
            <h2 className="lp-section-h2 lp-section-h2-light" style={{ marginTop: '14px' }}>
              The numbers<br />
              <span style={{ color: '#4ade80' }}>behind the platform.</span>
            </h2>
          </Reveal>
          <div className="lp-impact-grid">
            {IMPACT_STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
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

      {/* objectives */}
      <section className="lp-section lp-section-white">
        <Reveal><span className="lp-section-tag">Specific objectives</span></Reveal>
        <Reveal delay={80}>
          <h2 className="lp-section-h2">
            What success<br />
            <span className="lp-green">looks like.</span>
          </h2>
        </Reveal>
        <div className="lp-objectives-list">
          {OBJECTIVES.map((obj, i) => (
            <Reveal key={obj} delay={i * 80}>
              <div className="lp-objective-item">
                <span className="lp-objective-num">0{i + 1}</span>
                <p>{obj}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={520}>
          <NavLink to="/access" className="lp-cta-primary" style={{ marginTop: '36px', display: 'inline-flex' }}>
            Join the platform →
          </NavLink>
        </Reveal>
      </section>
    </SiteLayout>
  )
}

export default ImpactPage
