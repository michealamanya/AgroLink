import { NavLink } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { useReveal, Reveal } from '../components/RevealUtils'

const HIGHLIGHTS = [
  {
    icon: '🌾',
    title: 'Field-first coordination',
    text: 'Built around everyday agricultural workflows — from reporting outbreaks to circulating localized guidance — so nothing slips through the cracks.',
  },
  {
    icon: '🔒',
    title: 'Trusted service delivery',
    text: 'Role-based access ensures each stakeholder works with the right records while maintaining clear operational accountability.',
  },
  {
    icon: '🏛️',
    title: 'District visibility',
    text: 'Bushenyi district teams can track response activity, advisory coverage, and agro-input status from one shared system.',
  },
]

const PROBLEM_POINTS = [
  'Farmers have no reliable way to know when to plant or how to handle pests.',
  'Fake seeds and fertilizers flood the market — farmers cannot tell what is genuine.',
  'Extension officers and local government have no shared system to coordinate response.',
  'The district has no clear way to plan or track agricultural activity on the ground.',
]

function AboutPage() {
  return (
    <SiteLayout
      title="About AgroLink"
      subtitle="A Smart Agricultural Information and Agro-Input Management System for Bushenyi District, Uganda."
    >
      {/* Problem statement */}
      <section className="lp-section lp-section-white">
        <Reveal><span className="lp-section-tag">Why we built this</span></Reveal>
        <Reveal delay={80}>
          <h2 className="lp-section-h2">
            A real problem.<br />
            <span className="lp-green">A practical solution.</span>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="lp-section-lead">
            Farmers, agro-input dealers, extension officers, and government officials
            in Bushenyi District had no shared digital system connecting them. AgroLink
            was built to fix this by bringing everyone onto one simple platform.
          </p>
        </Reveal>
        <div className="lp-about-problems">
          {PROBLEM_POINTS.map((p, i) => (
            <Reveal key={p} delay={200 + i * 80}>
              <div className="lp-about-problem-item">
                <span className="lp-about-problem-dot" />
                <p>{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="lp-section lp-section-soft">
        <Reveal><span className="lp-section-tag">Our approach</span></Reveal>
        <Reveal delay={80}>
          <h2 className="lp-section-h2">
            Built for trusted,<br />
            <span className="lp-green">coordinated delivery.</span>
          </h2>
        </Reveal>
        <div className="lp-about-highlights">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.title} delay={i * 120}>
              <div className="lp-about-highlight-card">
                <span className="lp-about-highlight-icon">{h.icon}</span>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Objective */}
      <section className="lp-section lp-section-white">
        <Reveal><span className="lp-section-tag">Main objective</span></Reveal>
        <Reveal delay={80}>
          <h2 className="lp-section-h2">What AgroLink set out to do.</h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="lp-section-lead" style={{ maxWidth: '72ch' }}>
            To design and implement a web-based Smart Agricultural Information and
            Agro-Input Management System that improves access to agricultural information
            and quality agro-inputs, and strengthens coordination among farmers,
            agro-input dealers, extension officers, and government officials in
            Bushenyi District.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <NavLink to="/access" className="lp-cta-primary" style={{ marginTop: '28px', display: 'inline-flex' }}>
            Join the platform →
          </NavLink>
        </Reveal>
      </section>
    </SiteLayout>
  )
}

export default AboutPage
